import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useUpdateTask } from "../api/use-update-task";
import type { Task } from "../types";

export default function TaskDescription({
	task,
}: {
	task: Task;
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [value, setValue] = useState(task.description);
	const { mutate, isPending } = useUpdateTask();

	const handleSave = () => {
		mutate(
			{
				json: { description: value },
				param: { taskId: task.$id },
			},
			{
				onSuccess: () => {
					setIsEditing(false);
				},
			},
		);
	};
	return (
		<div className="p-4 border rounded-lg">
			<div className="flex items-center justify-between">
				<p className="text-lg font-semibold">Overview</p>
				<Button
					onClick={() => setIsEditing((prev) => !prev)}
					size="sm"
					variant="secondary"
				>
					{isEditing ? (
						<>
							<XIcon className="size-4" />
							Cancel
						</>
					) : (
						<>
							<PencilIcon className="size-4 mr-1" />
							Edit
						</>
					)}
				</Button>
			</div>
			<Separator className="my-4" />

			{isEditing ? (
				<div className="flex flex-col gap-y-4">
					<Textarea
						placeholder="Add a description"
						value={value}
						rows={2}
						onChange={(e) => setValue(e.target.value)}
						disabled={isPending}
					/>
					<Button
						size="sm"
						className="w-fit ml-auto"
						onClick={handleSave}
						disabled={isPending}
					>
						{isPending ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			) : (
				<div>
					{task.description || (
						<span className="text-muted-foreground">No description set</span>
					)}
				</div>
			)}
		</div>
	);
}
