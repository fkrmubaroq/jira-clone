import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteTask } from "@/features/tasks/api/use-delete-task";
import useEditTaskModal from "@/features/tasks/hooks/use-edit-task-modal";
import { useWorkspaceId } from "@/features/workspaces/api/use-workspace-id";
import ModalConfirmation from "@/features/workspaces/components/modal-confirmation";
import { useModal } from "@/hooks/use-modal";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function TaskActions({
  id,
  projectId,
  children,
}: {
  id: string;
  projectId: string;
  children: React.ReactNode;
}) {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useDeleteTask();
  const { open } = useEditTaskModal();
  const { show, showModal, hideModal } = useModal<"confirmation-delete">();
  const handleDelete = () => {
    mutate({ param: { taskId: id } }, { onSuccess: hideModal });
  };

  const onOpenTask = () => {
    router.push(`/workpsaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };
  return (
    <>
      {show && (
        <ModalConfirmation
          show={show}
          onHide={hideModal}
          onConfirm={handleDelete}
          title="Delete Task"
          message="This action cannot be undone"
          variant="destructive"
          isLoading={isPending}
        />
      )}
      <div className="flex justify-end">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={onOpenTask}
              disabled={isPending}
              className="font-medium p-[10px]"
            >
              <ExternalLinkIcon className="size-4 mr-1 stroke-2" />
              Task Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onOpenProject}
              disabled={isPending}
              className="font-medium p-[10px]"
            >
              <ExternalLinkIcon className="size-4 mr-1 stroke-2" />
              Open Project
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => open(id)}
              disabled={isPending}
              className="font-medium p-[10px]"
            >
              <PencilIcon className="size-4 mr-1 stroke-2" />
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => showModal("confirmation-delete")}
              disabled={isPending}
              className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
            >
              <TrashIcon className="size-4 mr-1 stroke-2" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
