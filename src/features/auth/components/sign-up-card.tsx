"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useRegister } from "../api/use-register";
import { registerSchema } from "../schema";

type FormSchema = z.infer<typeof registerSchema>;

export function SignUpCard() {
	const { mutate: mutateRegister, isPending } = useRegister();

	const form = useForm<FormSchema>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = (data: FormSchema) => {
		mutateRegister({ json: data });
	};

	return (
		<>
			<Card className="h-full w-full md:w-[487px] border-none shadow-none">
				<CardHeader className="flex items-center justify-center text-center p-7">
					<CardTitle className="text-2xl">Sign Up</CardTitle>
					<CardDescription>
						Create your account and start your journey with us.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-7">
					<Form {...form}>
						<form
							noValidate
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4"
						>
							<FormField
								name="email"
								control={form.control}
								render={({
									field,
									formState: {
										errors: { email },
									},
								}) => (
									<FormItem>
										<FormControl>
											<Input
												error={!!email}
												{...field}
												type="email"
												placeholder="Enter email address"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="name"
								control={form.control}
								render={({
									field,
									formState: {
										errors: { name },
									},
								}) => (
									<FormItem>
										<FormControl>
											<Input
												error={!!name}
												{...field}
												type="text"
												placeholder="Enter your name"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="password"
								control={form.control}
								render={({
									field,
									formState: {
										errors: { password },
									},
								}) => (
									<FormItem>
										<FormControl>
											<Input
												{...field}
												error={!!password}
												type="password"
												placeholder="Enter password"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button size="lg" className="w-full" disabled={isPending}>
								Register
							</Button>
							<CardDescription className="text-center">
								By signing up, you agree to our <br />
								<Link href="/privacy-policy">
									<span className="text-primary underline">Privacy Policy</span>
								</Link>{" "}
								and{" "}
								<Link href="/privacy-policy">
									<span className="text-primary underline">
										Terms of service
									</span>
								</Link>
							</CardDescription>
						</form>
					</Form>
				</CardContent>
				{/* <LineSeparator text="Or" /> */}
				<CardContent className="p-7 flex flex-col gap-y-4">
					{/* <Button
						variant="muted"
						size="lg"
						className="w-full"
						disabled={isPending}
					>
						<FcGoogle />
						Login with Google
					</Button>

					<Button
						variant="muted"
						size="lg"
						className="w-full"
						disabled={isPending}
					>
						<FaGithub />
						Login with Github
					</Button> */}
				</CardContent>

				<CardContent className="p-7 flex items-center justify-center">
					<p className="text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link className="text-blue-700" href="/sign-in">
							Sign In
						</Link>
					</p>
				</CardContent>
			</Card>
		</>
	);
}

// function LineSeparator({ text }: { text?: string }) {
// 	return (
// 		<div className="px-7">
// 			{text ? (
// 				<div className="flex items-center">
// 					<Separator className="!w-1/2 !shrink" />
// 					<span className="text-sm text-muted-foreground px-4">{text}</span>
// 					<Separator className="!w-1/2 !shrink" />
// 				</div>
// 			) : (
// 				<Separator />
// 			)}
// 		</div>
// 	);
// }
