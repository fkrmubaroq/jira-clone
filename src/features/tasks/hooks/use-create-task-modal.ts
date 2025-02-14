import { parseAsBoolean, parseAsJson, useQueryState } from "nuqs";
import { createTaskSchema } from "../schema";

export default function useCreateTaskModal() {
	const [isOpen, setIsOpen] = useQueryState(
		"create-task",
		parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
	);
	const [values, setValues] = useQueryState(
		"values",
		parseAsJson(createTaskSchema.partial().parse).withOptions({
			clearOnDefault: true,
		}),
	);

	const open = () => setIsOpen(true);
	const close = () => {
		setIsOpen(false);
		if (values) {
			setValues(null);
		}
	};
	return {
		isOpen,
		setIsOpen,
		close,
		open,
		setValues,
		values,
	};
}
