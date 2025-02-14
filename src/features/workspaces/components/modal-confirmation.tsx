import ResponsiveModal from "@/components/responsive-modal";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Loader } from "lucide-react";

export default function ModalConfirmation({
	title,
	message,
	show,
	variant,
	onHide,
	onConfirm,
	isLoading,
}: {
	isLoading: boolean;
	title: string;
	message: string;
	show: boolean;
	onHide: () => void;
	onConfirm: () => void;
	variant: ButtonProps["variant"];
}) {
	return (
		<ResponsiveModal open={show} onOpenChange={onHide}>
			<Card className="w-full h-full border-none shadow-none">
				<CardContent>
					<CardHeader className="flex flex-col justify-center text-center ">
						<CardTitle>{title}</CardTitle>
						<CardDescription>{message}</CardDescription>
					</CardHeader>

					<div className="pt-4 w-full flex gap-x-4 justify-end">
						<Button
							onClick={onHide}
							variant="outline"
							className="w-full"
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							onClick={onConfirm}
							variant={variant}
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? <Loader /> : "Delete"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</ResponsiveModal>
	);
}
