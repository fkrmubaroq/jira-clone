import { Separator } from "@/components/ui/separator";
import MemberAvatar from "@/features/members/components/member-avatar";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import TaskActions from "@/features/projects/components/task-actions";
import { MoreHorizontal } from "lucide-react";
import type { Task } from "../types";
import TaskDate from "./task-date";

export default function KanbanCard({ task }: { task: Task }) {
	return (
		<div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
			<div className="flex items-start justify-between gap-x-2">
				<p className="text-xs line-clamp-2">{task.name}</p>
				<TaskActions id={task.$id} projectId={task.projectId}>
					<MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
				</TaskActions>
			</div>
			<Separator />
			<div className="flex items-center gap-x-1.5">
				<MemberAvatar
					name={task.assignee.name}
					className="size-6"
					fallbackClassName="text-[12px]"
				/>
				<div className="size-1 rounded-full bg-neutral-300" />
				<TaskDate value={task.dueDate} className="text-xs" />
			</div>
			<div className="flex items-center gap-x-1.5">
				<ProjectAvatar
					name={task.project.name}
					image={task.project.imageUrl}
					textClassName="!text-xs"
					className="size-6"
				/>
			</div>
		</div>
	);
}
