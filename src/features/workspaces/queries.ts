import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { getMember } from "../members/utils";
import { Workspace } from "./types";

export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessionClient();
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
  workspaceId: string;
};
export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
  try {
    const { databases, account } = await createSessionClient();
    const user = await account.get();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
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



type GetWorkspaceInfoProps = {
  workspaceId: string;
};
export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceInfoProps) => {
  try {
    const { databases } = await createSessionClient();
    
    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return {
      name: workspace.name
    };
  } catch {
    return null;
  }
};
