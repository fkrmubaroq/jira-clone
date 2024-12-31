import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { createWorkspaceSchema } from "../schemas";

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { name } = c.req.valid("json");
    const payload = { name, userId: user.$id };
    console.log("x", user.$id)
    const workspaces = await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      payload
    );

    return c.json({ data: workspaces })
  }
);
export default app;
