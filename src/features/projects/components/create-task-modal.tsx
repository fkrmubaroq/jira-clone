"use client";

import ResponsiveModal from "@/components/responsive-modal";
import CreateTaskFormWrapper from "@/features/tasks/components/create-task-form-wrapper";
import useCreateTaskModal from "@/features/tasks/hooks/use-create-task-modal";

export default function CreateTaskModal() {
	const { isOpen, setIsOpen, values, setValues, close } = useCreateTaskModal();
	return (
		<ResponsiveModal
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				if (!open && values) {
					setValues(null);
				}
			}}
		>
			<CreateTaskFormWrapper onCancel={close} />
		</ResponsiveModal>
	);
}
