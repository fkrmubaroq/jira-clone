import type { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import AnalyticCard from "./analytics-card";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

export default function Analytics({ data }: ProjectAnalyticsResponseType) {
	return (
		<ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
			<div className="w-full flex flex-row">
				<div className="flex items-center flex-1">
					<AnalyticCard
						title="Total tasks"
						value={data.taskCount}
						variant={data.taskDifference > 0 ? "up" : "down"}
						increaseValue={data.taskDifference}
					/>
					<Separator orientation="vertical" />
				</div>
				<div className="flex items-center flex-1">
					<AnalyticCard
						title="Assigned Tasks"
						value={data.assignedTaskCount}
						variant={data.assigneedTaskDifference > 0 ? "up" : "down"}
						increaseValue={data.assigneedTaskDifference}
					/>
					<Separator orientation="vertical" />
				</div>
				<div className="flex items-center flex-1">
					<AnalyticCard
						title="Completed Tasks"
						value={data.completedTaskCount}
						variant={data.completedTaskDifference > 0 ? "up" : "down"}
						increaseValue={data.completedTaskDifference}
					/>
					<Separator orientation="vertical" />
				</div>
				<div className="flex items-center flex-1">
					<AnalyticCard
						title="Overdue Tasks"
						value={data.overdueTaskCount}
						variant={data.overdueTaskDifference > 0 ? "up" : "down"}
						increaseValue={data.overdueTaskDifference}
					/>
					<Separator orientation="vertical" />
				</div>
				<div className="flex items-center flex-1">
					<AnalyticCard
						title="Incomplete Tasks"
						value={data.incompleteTaskCount}
						variant={data.incompleteTaskDifference > 0 ? "up" : "down"}
						increaseValue={data.incompleteTaskDifference}
					/>
					<Separator orientation="vertical" />
				</div>
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}
