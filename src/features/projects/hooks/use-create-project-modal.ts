import { parseAsBoolean, useQueryState } from "nuqs";

export default function useCreateProjectModal() {
	const [isOpen, setIsOpen] = useQueryState(
		"create-project",
		parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
	);

	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);
	return {
		isOpen,
		setIsOpen,
		close,
		open,
	};
}
