import type { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import AnalyticCard from "./analytics-card";
import { ScrollArea } from "./ui/scroll-area";

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
				</div>
			</div>
		</ScrollArea>
	);
}
