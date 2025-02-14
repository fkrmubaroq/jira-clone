import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export const getWorkspaces = async () => {
	try {
		const { account, databases } = await createSessionClient();
		const user = await account.get();

		const workspaces = await databases.listDocuments(
			DATABASE_ID,
			WORKSPACES_ID,
			[Query.equal("userId", user.$id)],
		);

		return workspaces;
	} catch {
		return null;
	}
};
