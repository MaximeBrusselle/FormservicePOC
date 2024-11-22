import type { APIRoute } from "astro";
import base64 from "base64-js";
import convert from "xml-js";
import axios from "axios";
import { getSecret } from "astro:env/server";

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
	debugger;
	const requestData = await request.json();
	const options = {compact: true, ignoreComment: true, spaces: 4};
	const dataToRender = convert.json2xml(requestData, options);
	console.log(dataToRender);

	if (!dataToRender || dataToRender === "") {
		return new Response(
			JSON.stringify({
				pdfBlob: "",
				message: "Missing required fields",
			}),
			{ status: 400 },
		);
	}
	// Do something with the data, then return a success response
	return new Response(
		JSON.stringify({
			pdfBlob: "",
			message: "Success!",
		}),
		{ status: 200 },
	);
};
