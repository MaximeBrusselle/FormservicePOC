import type { APIRoute } from "astro";
import base64 from "base64-js";
import convert from "xml-js";
import { getSecret } from "astro:env/server";
import type { CustomerData } from "@/types/Customer";
import type { FormData } from "@/types/FormData";

interface RequestData {
	language: string;
	customerData: CustomerData;
	formData: {
		[key: string]: FormData;
	};
}

async function getAccessToken() {
	const clientSecretBase64 = getSecret("CLIENT_SECRET_BASE64")!;
	const clientSecret = Buffer.from(clientSecretBase64, 'base64').toString('utf-8');
	
	const payload = new URLSearchParams({
		grant_type: "client_credentials",
		client_id: getSecret("CLIENT_ID")!,
		client_secret: clientSecret,
	});
	const url = getSecret("TOKEN_URL")!;
	
	const response = await fetch(url, {
		method: "POST",
		body: payload,
	});

	if (!response.ok) {
		throw new Error(`Failed to get access token: ${response.statusText}`);
	}

	const tokenData = await response.json();
	return tokenData.access_token;
}

async function renderPDF(token: string, data: string, templateName: string) {
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
		"Content-Encoding": "utf-8",
	};

	const payload = {
		xdpTemplate: templateName,
		xmlData: data,
	};

	const response = await fetch(`${getSecret("FORM_SERVICE_URL")}/v1/adsRender/pdf?templateSource=storageName&Tracelevel=2`, {
		method: "POST",
		headers,
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error(`Failed to render PDF: ${response.statusText}`);
	}

	const responseData = await response.json();

	return responseData.fileContent;
}

export const POST: APIRoute = async ({ request }) => {
	try {
		const { language, customerData, formData }: RequestData = await request.json();
		
		// Validate required data
		if (!customerData || !formData) {
			return new Response(
				JSON.stringify({
					pdfBlob: "",
					message: "Missing required data",
				}),
				{ status: 400 },
			);
		}

		// Convert data to XML
		const options = { compact: true, ignoreComment: true, spaces: 4 };
		const templateName = `${customerData.name}/${language}`;
		const dataToRender = convert.json2xml(JSON.stringify(formData), options);
		const base64Data = base64.fromByteArray(Buffer.from(dataToRender, "utf-8"));

		const accessToken = await getAccessToken();
		const pdfBuffer = await renderPDF(accessToken, base64Data, templateName);

		
		if (!pdfBuffer) {
			return new Response(
				JSON.stringify({
					pdfBlob: "",
					message: "Failed to render PDF",
				}),
				{ status: 500 },
			);
		}

		// Return success response with PDF blob
		return new Response(
			JSON.stringify({
				pdfBlob: pdfBuffer,
				message: "PDF generated successfully!",
			}),
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error in renderPDF endpoint:', error);
		return new Response(
			JSON.stringify({
				pdfBlob: "",
				message: error instanceof Error ? error.message : "An unknown error occurred",
			}),
			{ status: 500 },
		);
	}
};
