import { z } from "zod";

export const schemaMembers = z.object({ workspaceId: z.string() });
