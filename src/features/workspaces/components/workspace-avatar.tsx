import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function WorkspaceAvatar({
	image,
	name,
	className,
}: {
	image?: string;
	name: string;
	className?: string;
}) {
	return (
		<div className="flex justify-start items-center gap-3 font-medium">
			{image ? (
				<div
					className={cn(
						"relative size-7 rounded-md overflow-hidden",
						className,
					)}
				>
					<Image src={image} alt={name} fill className="object-cover" />
				</div>
			) : (
				<Avatar className={cn("size-7", className)}>
					<AvatarFallback className="text-white bg-blue-600 font-semibold font-semibold uppercase">
						{name[0]}
					</AvatarFallback>
				</Avatar>
			)}
			<span className="truncate">{name}</span>
		</div>
	);
}
