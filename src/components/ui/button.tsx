import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	cn(
		"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors",
		"border border-neutral-200 shadow-sm",
		"disabled:pointer-events-none disabled:opacity-50 disabled:bg-neutral-300 disabled:from-neutral-300 disabled:to-neutral-300 disabled:text-muted-foreground",
		"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
		"[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ",
	),
	{
		variants: {
			variant: {
				primary:
					"bg-gradient-to-b from-blue-600 to-blue-600 text-primary-foreground hover:bg-from-blue-700 hover:to-blue-700",
				destructive:
					"bg-gradient-to-b from-amber-600 to-amber-700 text-destructive-foreground hover:from-amber-700 hover:to-amber-700",
				outline:
					"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-white text-black hover:bg-neutral-100",
				ghost:
					"border-transparent shadow-none hover:bg-accent hover:text-accent-foreground",
				muted: "bg-neutral-200 text-neutral-600 hover:bg-neutral-200/80",
				teritary:
					"bg-blue-100 text-blue-600 border-transparent hover:bg-blue-200 shadow-none",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-8 rounded-sm px-3 text-xs",
				lg: "h-10 rounded-sm px-8",
				xs: "h-6 rounded-sm px-3 text-xs",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
