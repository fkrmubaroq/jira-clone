"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useInviteCode from "../api/use-invite-code";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useWorkspaceId } from "../api/use-workspace-id";

export const JoinWorkspaceForm = ({
	initialValues,
}: {
	initialValues: {
		name: string;
	};
}) => {
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const inviteCode = useInviteCode();
	const { mutate, isPending } = useJoinWorkspace();

	const onSubmit = () => {
		mutate(
			{
				param: { workspaceId },
				json: {
					code: inviteCode,
				},
			},
			{
				onSuccess: ({ data }) => {
					router.push(`/workspaces/${data.$id}`);
				},
			},
		);
	};
	return (
		<Card className="w-full h-full border-none shadow-none">
			<CardHeader className="p-7">
				<CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
				<CardDescription>
					You&apos;ve been invited to join <strong>{initialValues.name}</strong>
				</CardDescription>
			</CardHeader>
			<Separator className="px-7" />
			<CardContent className="p-7">
				<div className="flex flex-col gap-y-2 lg:flex-row items-center justify-between">
					<Button
						variant="secondary"
						type="button"
						asChild
						size="lg"
						className="w-full lg:w-fit"
						disabled={isPending}
					>
						<Link href="/">Cancel</Link>
					</Button>
					<Button
						size="lg"
						type="button"
						className="w-full lg:w-fit"
						onClick={onSubmit}
						disabled={isPending}
					>
						Join Workspace
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
