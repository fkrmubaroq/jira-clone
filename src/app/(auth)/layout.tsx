"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
	children,
}: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isSignUp = pathname === "/sign-up";
	return (
		<main className="bg-neutral-200 min-h-screen">
			<div className="mx-auto max-w-screen-2xl p-4">
				<nav className="flex justify-between items-center">
					<Image src="/logo.svg" alt="Jira Clone" width={56} height={56} />
					<Button asChild variant="secondary">
						<Link href={isSignUp ? "/sign-in" : "/sign-up"}>
							{isSignUp ? "Sign In" : "Sign Up"}
						</Link>
					</Button>
				</nav>
				<div className="flex flex-col items-center justify-center pt-4 md:pt-14">
					{children}
				</div>
			</div>
		</main>
	);
}
