import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { cookies } from "next/headers";
import { Account, Databases, Query } from "node-appwrite";
import { AUTH_COOKIE } from "../auth/constant";
import { initiateAppWriteClient } from "../auth/server/utils";
import { getMember } from "../members/utils";
import { Workspace } from "./types";

export const getWorkspaces = async () => {
  try {
    const client = initiateAppWriteClient();
    const session = cookies().get(AUTH_COOKIE);
    if (!session?.value) return null;

    client.setSession(session.value);

    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.equal("userId", user.$id)]
    );

    return workspaces;

  } catch {
    return null;
  }
};

type GetWorkspaceProps = {
  workspaceId:string;
}
export const getWorkspace = async ({ workspaceId} : GetWorkspaceProps) => {
  try {
    const client = initiateAppWriteClient();
    const session = cookies().get(AUTH_COOKIE);
    if (!session?.value) return null;

    client.setSession(session.value);

    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId
    })

    if(!member){
      return null;
    }

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return workspace;

  } catch {
    return null;
  }
};
