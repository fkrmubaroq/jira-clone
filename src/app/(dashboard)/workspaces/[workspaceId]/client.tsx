"use client";
import Analytics from "@/components/analytics";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetMembers } from "@/features/members/api/user-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetWorkspaceAnalytics } from "@/features/projects/api/use-get-workspace-analytics";
import useCreateProjectModal from "@/features/projects/hooks/use-create-project-modal";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import useCreateTaskModal from "@/features/tasks/hooks/use-create-task-modal";
import type { Task } from "@/features/tasks/types";
import { useWorkspaceId } from "@/features/workspaces/api/use-workspace-id";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function WorkspaceIdClient() {
	const workspaceId = useWorkspaceId();
	const { data: analytics, isLoading: isLoadingAnalytics } =
		useGetWorkspaceAnalytics({ workspaceId });
	const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
		workspaceId,
	});
	const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
		workspaceId,
	});
	const { data: members, isLoading: isLoadingMembers } = useGetMembers({
		workspaceId,
	});
	const { open: createProject } = useCreateProjectModal();
	const isLoading =
		isLoadingAnalytics ||
		isLoadingTasks ||
		isLoadingProjects ||
		isLoadingMembers;

	if (!isLoading) return <PageLoader />;
	if (!analytics || !tasks || !projects || !members) {
		return <PageError message="Failed to load workspace data" />;
	}

	return (
		<div className="h-full flex flex-col space-y-4">
			<Analytics data={analytics} />
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
				<TaskList data={tasks.documents} total={tasks.total} />
			</div>
		</div>
	);
}

function TaskList({ data, total }: { data: Task[]; total: number }) {
	const { open: createTask } = useCreateTaskModal();
	const workspaceId = useWorkspaceId();
	return (
		<div className="flex flex-col gap-y-4 col-span-1">
			<div className="bg-muted rounded-lg p-4">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">Tasks ({total})</p>
					<Button variant="muted" size="icon" onClick={createTask}>
						<PlusIcon className="size-4 text-neutral-400" />
					</Button>
				</div>
				<Separator className="my-4" />
				<ul className="flex flex-col gap-y-4">
					{data.map((task) => (
						<li key={task.$id}>
							<Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
								asd
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
