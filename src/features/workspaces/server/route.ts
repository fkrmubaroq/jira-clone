import {
	DATABASE_ID,
	IMAGES_BUCKET_ID,
	TASKS_ID,
	WORKSPACES_ID,
} from "@/config";
import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { TaskStatus } from "@/features/tasks/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCode } from "@/lib/utils";
import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { MEMBERS_ID } from "../../../config";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import type { Workspace } from "../types";

const app = new Hono()
	.get("/", sessionMiddleware, async (c) => {
		const user = c.get("user");
		const databases = c.get("databases");

		const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
			Query.equal("userId", user.$id),
		]);
		if (members.total === 0) {
			return c.json({ data: { documents: [], total: 0 } });
		}

		const workspaceIds = members.documents.map((member) => member.workspaceId);

		const workspaces = await databases.listDocuments(
			DATABASE_ID,
			WORKSPACES_ID,
			[Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)],
		);
		return c.json({ data: workspaces });
	})
	.get("/:workspaceId", sessionMiddleware, async (c) => {
		const user = c.get("user");
		const databases = c.get("databases");
		const { workspaceId } = c.req.param();
		const member = await getMember({
			databases,
			workspaceId,
			userId: user.$id,
		});
		if (!member) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		const workspace = await databases.getDocument<Workspace>(
			DATABASE_ID,
			WORKSPACES_ID,
			workspaceId,
		);

		return c.json({ data: workspace });
	})
	.get("/:workspaceId/info", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const { workspaceId } = c.req.param();

		const workspace = await databases.getDocument<Workspace>(
			DATABASE_ID,
			WORKSPACES_ID,
			workspaceId,
		);

		return c.json({
			data: {
				$id: workspace.$id,
				name: workspace.name,
				imageUrl: workspace.imageUrl,
			},
		});
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
					image,
				);

				const arrayBuffer = await storage.getFilePreview(
					IMAGES_BUCKET_ID,
					file.$id,
				);

				uploadedImageUrl = `data:image/png;base64, ${Buffer.from(
					arrayBuffer,
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
				payload,
			);

			await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
				userId: user.$id,
				workspaceId: workspaces.$id,
				role: MemberRole.ADMIN,
			});

			return c.json({ data: workspaces });
		},
	)
	.patch(
		"/:workspaceId",
		sessionMiddleware,
		zValidator("form", updateWorkspaceSchema),
		async (c) => {
			const databases = c.get("databases");
			const storage = c.get("storage");
			const user = c.get("user");
			const { workspaceId } = c.req.param();
			const { name, image } = c.req.valid("form");

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});

			if (!member || member.role !== MemberRole.ADMIN) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			let uploadedImageUrl: string | undefined = image as string;
			if (image instanceof File) {
				const file = await storage.createFile(
					IMAGES_BUCKET_ID,
					ID.unique(),
					image,
				);

				const arrayBuffer = await storage.getFilePreview(
					IMAGES_BUCKET_ID,
					file.$id,
				);

				uploadedImageUrl = `data:image/png;base64, ${Buffer.from(
					arrayBuffer,
				).toString("base64")}`;
			}

			const workspace = await databases.updateDocument(
				DATABASE_ID,
				WORKSPACES_ID,
				workspaceId,
				{
					name,
					imageUrl: uploadedImageUrl,
				},
			);

			return c.json({ data: workspace });
		},
	)
	.delete("/:workspaceId", sessionMiddleware, async (c) => {
		const { workspaceId } = c.req.param();
		try {
			const databases = c.get("databases");
			const user = c.get("user");

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});
			if (!member || member.role !== MemberRole.ADMIN) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			// TODO: Delete Member, projects, and tasks

			await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

			return c.json({
				success: true,
				message: "Workspace deleted",
				data: { $id: workspaceId },
			});
		} catch (e: any) {
			return c.json({
				success: false,
				data: { $id: workspaceId },
				message: e.message || "Error deleting workspace",
			});
		}
	})
	.post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
		const { workspaceId } = c.req.param();
		try {
			const databases = c.get("databases");
			const user = c.get("user");

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});
			if (!member || member.role !== MemberRole.ADMIN) {
				return c.json({ error: "Unauthorized" }, 401);
			}

			const workspace = await databases.updateDocument(
				DATABASE_ID,
				WORKSPACES_ID,
				workspaceId,
				{
					inviteCode: generateInviteCode(7),
				},
			);

			return c.json({
				success: true,
				message: "Workspace deleted",
				data: workspace,
			});
		} catch (e: any) {
			return c.json({
				success: false,
				data: { $id: workspaceId },
				message: e.message || "Error deleting workspace",
			});
		}
	})
	.post(
		"/:workspaceId/join",
		sessionMiddleware,
		zValidator(
			"json",
			z.object({
				code: z.string(),
			}),
		),
		async (c) => {
			const { workspaceId } = c.req.param();
			const { code } = c.req.valid("json");
			const databases = c.get("databases");
			const user = c.get("user");

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});

			if (member) {
				return c.json({ error: "Already a member" }, 400);
			}

			const workspace = await databases.getDocument<Workspace>(
				DATABASE_ID,
				WORKSPACES_ID,
				workspaceId,
			);

			if (workspace.inviteCode !== code) {
				return c.json({ error: "Invalid invite code" }, 400);
			}

			const payload = {
				workspaceId,
				userId: user.$id,
				role: MemberRole.MEMBER,
			};
			await databases.createDocument(
				DATABASE_ID,
				MEMBERS_ID,
				ID.unique(),
				payload,
			);

			return c.json({ data: workspace }, 200);
		},
	)
	.get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
		const databases = c.get("databases");
		const user = c.get("user");
		const { workspaceId } = c.req.param();

		const member = await getMember({
			databases,
			workspaceId,
			userId: user.$id,
		});
		if (!member) {
			return c.json({ error: "Unauthorized" }, 400);
		}

		const now = new Date();
		const thisMonthStart = startOfMonth(now);
		const thisMonthEnd = endOfMonth(now);
		const lastMonthStart = startOfMonth(subMonths(now, 1));
		const lastMonthEnd = endOfMonth(subMonths(now, 1));

		const thisMonthTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("workspaceId", workspaceId),
				Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
			],
		);

		const lasMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
			Query.equal("workspaceId", workspaceId),
			Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
			Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
		]);

		const taskCount = thisMonthTasks.total;
		const taskDifference = taskCount - lasMonthTasks.total;

		const thisMonthAssignedTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("workspaceId", workspaceId),
				Query.equal("assigneeId", member.$id),
				Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
			],
		);

		const lastMonthAssignedTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("workspaceId", workspaceId),
				Query.equal("assigneeId", member.$id),
				Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
			],
		);

		const assignedTaskCount = thisMonthAssignedTasks.total;
		const assigneedTaskDifference =
			assignedTaskCount - lastMonthAssignedTasks.total;

		const thisMonthIncompleteTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("workspaceId", workspaceId),
				Query.notEqual("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
			],
		);

		const lastMonthIncompleteTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("workspaceId", workspaceId),
				Query.notEqual("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
			],
		);

		const incompleteTaskCount = thisMonthIncompleteTasks.total;
		const incompleteTaskDifference =
			incompleteTaskCount - lastMonthIncompleteTasks.total;

		const thisMonthCompletedTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("workspaceId", workspaceId),
				Query.equal("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
			],
		);

		const lastMonthCompletedTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("workspaceId", workspaceId),
				Query.equal("status", TaskStatus.DONE),
				Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
			],
		);

		const completedTaskCount = thisMonthCompletedTasks.total;
		const completedTaskDifference =
			incompleteTaskCount - lastMonthCompletedTasks.total;

		const thisMonthOverdueTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("workspaceId", workspaceId),
				Query.notEqual("status", TaskStatus.DONE),
				Query.lessThan("dueDate", now.toISOString()),
				Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
			],
		);

		const lastMonthOverdueTasks = await databases.listDocuments(
			DATABASE_ID,
			TASKS_ID,
			[
				Query.equal("workspaceId", workspaceId),
				Query.notEqual("status", TaskStatus.DONE),
				Query.lessThan("dueDate", now.toISOString()),
				Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
				Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
			],
		);

		const overdueTaskCount = thisMonthOverdueTasks.total;
		const overdueTaskDifference =
			overdueTaskCount - lastMonthOverdueTasks.total;

		return c.json({
			data: {
				taskCount,
				taskDifference,
				assignedTaskCount,
				assigneedTaskDifference,
				completedTaskCount,
				completedTaskDifference,
				incompleteTaskCount,
				incompleteTaskDifference,
				overdueTaskCount,
				overdueTaskDifference,
			},
		});
	});
export default app;
