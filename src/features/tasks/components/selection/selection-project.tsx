import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FolderIcon } from "lucide-react";

export default function SelectionProject({
	value,
	onChange,
	options,
}: {
	options: { value: string; label: string }[] | undefined;
	value: string | null;
	onChange: (value: string) => void;
}) {
	return (
		<Select
			defaultValue={value || undefined}
			onValueChange={(value) => onChange(value)}
		>
			<SelectTrigger className="w-full lg:w-auto h-8">
				<div className="flex items-center pr-2">
					<FolderIcon className="size-4 mr-2" />
					<SelectValue placeholder="All projects" />
				</div>
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All projects</SelectItem>
				<SelectSeparator />
				{options?.map((item) => (
					<SelectItem value={item.value} key={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
