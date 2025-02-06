import { parseAsBoolean, useQueryState } from "nuqs";

export default function useCreateTaskModal() {
    const [isOpen, setIsOpen] = useQueryState("create-task",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    )

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    return {
        isOpen,
        setIsOpen,
        close,
        open
    }
}