import type { APIRoute } from "astro";
import base64 from "base64-js";
import convert from "xml-js";
import axios from "axios";
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
	const payload = new URLSearchParams({
		grant_type: "client_credentials",
		client_id: getSecret("CLIENT_ID")!,
		client_secret: getSecret("CLIENT_SECRET")!,
	});

	const response = await axios.post(getSecret("TOKEN_URL")!, payload, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});

	if (!response.status || response.status !== 200) {
		throw new Error(`Failed to get access token: ${response.statusText}`);
	}

	const tokenData = await response.data();
	return tokenData.access_token;
}

async function renderPDF(token: string, data: string) {
	const headers = {
		Authorization: `Bearer ${token}`,
		"Content-Type": "application/json",
		"Content-Encoding": "utf-8",
	};
	const payload = {
		xdpTemplate: "testform/testtemplate2",
		xmlData: data,
	};
	const response = await axios.post(
		`${getSecret("FORM_SERVICE_URL")!}/v1/adsRender/pdf?templateSource=storageName&Tracelevel=2`,
		payload,
		{ headers },
	);

	if (response.status !== 200) {
		throw new Error(`Failed to render PDF: ${response.statusText}`);
	}

	const responseData = response.data.fileContent;
	return responseData;
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

		// Get access token
		// const accessToken = await getAccessToken();

		// Convert data to XML
		const options = { compact: true, ignoreComment: true, spaces: 4 };
		const templateName = `${customerData.name}/${language}`;
		const dataToRender = convert.json2xml(JSON.stringify(formData), options);

		if (!dataToRender || dataToRender === "") {
			return new Response(
				JSON.stringify({
					pdfBlob: "",
					message: "Failed to convert data to XML",
				}),
				{ status: 400 },
			);
		}

		// Render PDF
		// const pdfBlob = await renderPDF(accessToken, dataToRender);

		// if (!pdfBlob) {
			// return new Response(
			// 	JSON.stringify({
			// 		pdfBlob: "",
			// 		message: "Failed to render PDF",
			// 	}),
			// 	{ status: 500 },
			// );
		// }

		// Return success response with PDF blob
		return new Response(
			JSON.stringify({
				pdfBlob: "",
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
