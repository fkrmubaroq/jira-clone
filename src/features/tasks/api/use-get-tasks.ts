import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono";
import type { TaskStatus } from "../types";

export type ResponseGetTasks = InferResponseType<
	(typeof client.api.tasks)["$get"]
>;

export const useGetTasks = ({
	workspaceId,
	projectId,
	status,
	assigneeId,
	dueDate,
	search,
}: {
	workspaceId: string;
	projectId?: string | null;
	status?: TaskStatus | null;
	assigneeId?: string | null;
	dueDate?: string | null;
	search?: string | null;
}) => {
	const query = useQuery({
		queryKey: [
			"tasks",
			workspaceId,
			projectId,
			status,
			search,
			assigneeId,
			dueDate,
		],
		queryFn: async () => {
			const response = await client.api.tasks.$get({
				query: {
					workspaceId,
					projectId: projectId || undefined,
					assigneeId: assigneeId || undefined,
					status: status || undefined,
					dueDate: dueDate || undefined,
					search: search || undefined,
				},
			});
			if (!response.ok) {
				throw new Error("Failed to fetch tasks");
			}

			const { data } = await response.json();
			return data;
		},
	});

	return query;
};
