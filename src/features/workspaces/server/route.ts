import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";
import { MemberRole } from "@/features/members/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCode } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { MEMBERS_ID } from "../../../config";
import { createWorkspaceSchema } from "../schemas";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.equal("userId", user.$id)]
    );
    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image } = c.req.valid("form");
      let uploadedImageUrl: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64, ${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const payload = {
        name,
        userId: user.$id,
        imageUrl: uploadedImageUrl,
        inviteCode: generateInviteCode(7),
      };

      const workspaces = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        payload
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspaces.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspaces });
    }
  );
export default app;
