import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MemberAvatar from "@/features/members/components/member-avatar";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { PencilIcon } from "lucide-react";
import useEditTaskModal from "../hooks/use-edit-task-modal";
import type { Task } from "../types";
import OverviewProperty from "./overview-property";
import TaskDate from "./task-date";

export default function TaskOverview({ task }: { task: Task }) {
	const { open } = useEditTaskModal();
	return (
		<div className="flex flex-col gap-y-4 ">
			<div className="bg-muted rounded-lg p-4">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">Overview</p>
					<Button size="sm" variant="secondary" onClick={() => open(task.$id)}>
						<PencilIcon className="size-4 mr-1" />
					</Button>
				</div>
				<Separator className="my-4" />
				<div className="flex flex-col gap-y-4">
					<OverviewProperty label="Assignee">
						<MemberAvatar name={task.assignee.name} className="size-6" />
						<p className="text-sm font-medium">{task.assignee.name}</p>
					</OverviewProperty>
					<OverviewProperty label="Due Date">
						<TaskDate value={task.dueDate} className="text-sm font-medium" />
					</OverviewProperty>
					<OverviewProperty label="Status">
						<Badge variant={task.status}>
							{snakeCaseToTitleCase(task.status)}
						</Badge>
					</OverviewProperty>
				</div>
			</div>
		</div>
	);
}
