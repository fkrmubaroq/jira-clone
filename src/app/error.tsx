"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
	return (
		<div className="h-screen flex flex-col gap-y-2 items-center justify-center ">
			<AlertTriangleIcon className="size-10 text-muted-foreground" />
			<p className="text-sm text-muted-foreground">Something went wrong</p>
			<Button variant="secondary" size="sm">
				<Link href="/">Back to home</Link>
			</Button>
		</div>
	);
}
