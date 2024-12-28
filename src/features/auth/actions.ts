"use server";

import { cookies } from "next/headers";
import { Account } from "node-appwrite";
import { AUTH_COOKIE } from "./constant";
import { initiateAppWriteClient } from "./server/utils";

export const getCurrent = async () => {
  try {
    const client = initiateAppWriteClient();
    const session = cookies().get(AUTH_COOKIE);
    if (!session?.value) return null;

    client.setSession(session.value);

    const account = new Account(client);

    return await account.get();
  } catch {
    return null;
  }
};
