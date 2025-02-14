import { Button } from "@/components/ui/button";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import type { Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/api/use-workspace-id";
import ModalConfirmation from "@/features/workspaces/components/modal-confirmation";
import { useModal } from "@/hooks/use-modal";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeleteTask } from "../api/use-delete-task";
import type { Task } from "../types";

export default function TaskBreadcrumbs({
	project,
	task,
}: {
	project: Project;
	task: Task;
}) {
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const { mutate, isPending: isDeletingTask } = useDeleteTask();
	const { showModal, hideModal, show } = useModal<"confirmation-delete-task">();
	const handleDelete = () => {
		mutate(
			{ param: { taskId: task.$id } },
			{
				onSuccess: () => {
					router.push(`/workspaces/${workspaceId}/tasks`);
				},
			},
		);
	};

	return (
		<>
			{show && (
				<ModalConfirmation
					show
					onHide={hideModal}
					onConfirm={handleDelete}
					title="Delete task"
					message="This action cannot be undone"
					variant="destructive"
					isLoading={isDeletingTask}
				/>
			)}
			<div className="flex items-center gap-x-2">
				<ProjectAvatar
					name={project.name}
					image={project.imageUrl}
					className="size-6 lg:size-8"
					showText={false}
				/>

				<Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
					<p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
						{project.name}
					</p>
				</Link>
				<ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
				<p className="text-sm lg:text-lg font-semibold">{task.name}</p>
				<Button
					disabled={isDeletingTask}
					className="ml-auto"
					variant="destructive"
					size="sm"
					onClick={() => showModal("confirmation-delete-task")}
				>
					<TrashIcon className="size-4 lg:mr-1" />
					<span className="hidden lg:block">Delete Task</span>
				</Button>
			</div>
		</>
	);
}
