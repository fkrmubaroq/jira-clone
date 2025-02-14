import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ListCheckIcon } from "lucide-react";
import { TaskStatus } from "../../types";

export default function SelectionStatus({
	value,
	onChange,
}: {
	value: TaskStatus | null;
	onChange: (value: string) => void;
}) {
	return (
		<Select
			defaultValue={value || undefined}
			onValueChange={(value) => onChange(value)}
		>
			<SelectTrigger className="w-full lg:w-auto h-8">
				<div className="flex items-center pr-2">
					<ListCheckIcon className="size-4 mr-2" />
					<SelectValue placeholder="All statuses" />
				</div>
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All statuses</SelectItem>
				<SelectSeparator />
				<SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
				<SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
				<SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
				<SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
				<SelectItem value={TaskStatus.DONE}>Done</SelectItem>
			</SelectContent>
		</Select>
	);
}
