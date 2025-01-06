import { parseAsBoolean, useQueryState } from "nuqs";
export default function useCreateWorkspaceModal() {
    const [isOpen, setIsOpen] = useQueryState("create-workspace",
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