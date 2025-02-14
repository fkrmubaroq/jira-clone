import DatePicker from "@/components/ui/date-picker";
import { useGetMembers } from "@/features/members/api/user-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/api/use-workspace-id";
import useTaskFilters from "../hooks/use-task-filters";
import type { TaskStatus } from "../types";
import SelectionAssignee from "./selection/selection-assignee";
import SelectionProject from "./selection/selection-project";
import SelectionStatus from "./selection/selection-status";

export default function DataFilters({
	hideProjectFilter,
}: {
	hideProjectFilter?: boolean;
}) {
	const workspaceId = useWorkspaceId();
	const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
		workspaceId,
	});
	const { data: members, isLoading: isLoadingMembers } = useGetMembers({
		workspaceId,
	});
	const isLoading = isLoadingProjects || isLoadingMembers;

	const projectOptions = projects?.documents.map((project) => ({
		value: project.$id,
		label: project.name,
	}));
	const memberOptions = members?.documents.map((member) => ({
		value: member.$id,
		label: member.name,
	}));
	const [{ status, assigneeId, projectId, dueDate }, setFilters] =
		useTaskFilters();

	const onStatusChange = (value: string) => {
		setFilters({ status: value === "all" ? null : (value as TaskStatus) });
	};
	const onAssigneeChange = (value: string) => {
		setFilters({ assigneeId: value === "all" ? null : (value as string) });
	};
	const onProjectChange = (value: string) => {
		setFilters({ projectId: value === "all" ? null : (value as string) });
	};
	if (isLoading) return <></>;
	return (
		<div className="flex flex-col lg:flex-row gap-2 mb-1">
			<SelectionStatus value={status} onChange={onStatusChange} />
			<SelectionAssignee
				options={memberOptions}
				value={assigneeId}
				onChange={onAssigneeChange}
			/>
			{!hideProjectFilter && (
				<SelectionProject
					options={projectOptions}
					value={projectId}
					onChange={onProjectChange}
				/>
			)}
			<DatePicker
				placeholder="Due date"
				className="h-8 w-full lg:w-auto"
				value={dueDate ? new Date(dueDate) : undefined}
				onChange={(date) => {
					setFilters({ dueDate: date ? date.toISOString() : null });
				}}
			/>
		</div>
	);
}
