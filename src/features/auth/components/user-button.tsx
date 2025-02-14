"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Loader, LogOut } from "lucide-react";
import { useCurrent } from "../api/use-current";
import { useLogout } from "../api/use-logout";

export const UserButton = () => {
	const { data: user, isLoading } = useCurrent();
	const { mutate: logout } = useLogout();
	if (isLoading) {
		return <LoaderUser />;
	}

	const avatarLetter = user?.name.charAt(0) || user?.email?.charAt(0) || "?";

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className="outeline-none relative">
				<AvatarLetter letter={avatarLetter} />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				side="bottom"
				className="w-60"
				sideOffset={10}
			>
				<div className="flex flex-col items-center justify-center gap-2  pt-4 pb-0">
					<AvatarLetter
						letter={avatarLetter}
						className="size-[52px] hover:opacity-100"
						classNameAvatarFallback="text-xl"
					/>
					<div className="flex flex-col items-center justify-center">
						<p className="text-sm font-semibold text-neutral-900">
							{user?.name || "User"}
						</p>
						<p className="text-xs text-neutral-500">{user?.email || ""}</p>
					</div>
					<Separator className="mt-2" />
					<DropdownMenuItem
						className="h-10 w-full flex items-center justify-center text-amber-700  font-medium cursor-pointer"
						onClick={() => logout()}
					>
						<LogOut className="size-4" />
						Logout
					</DropdownMenuItem>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

function AvatarLetter({
	letter,
	className,
	classNameAvatarFallback,
}: { letter: string; className?: string; classNameAvatarFallback?: string }) {
	return (
		<Avatar
			className={cn(
				"size-10 hover:opacity-75 transition border border-neutral-300",
				className,
			)}
		>
			<AvatarFallback
				className={cn(
					"bg-neutral-200 font-medium text-neutral-500",
					"flex items-center justify-center uppercase",
					classNameAvatarFallback,
				)}
			>
				{letter}
			</AvatarFallback>
		</Avatar>
	);
}
function LoaderUser() {
	return (
		<div
			className={cn(
				"size-10 roudned-full flex items-center justify-center ",
				"bg-neutral-200 border border-neutral-300",
			)}
		>
			<Loader className="size-4 animate-spin text-muted-foreground" />
		</div>
	);
}
