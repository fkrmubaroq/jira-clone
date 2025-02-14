import { Client } from "node-appwrite";

export function initiateAppWriteClient() {
	return new Client()
		.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
		.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
}
