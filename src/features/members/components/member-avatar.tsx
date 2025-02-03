import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function MemberAvatar({
    name,
    className,
    fallbackClassName
}: {
    name: string;
    className?: string;
    fallbackClassName?: string
}) {

    return (

        <Avatar className={cn("size-5 transition border border-neutral-300 rounded-full", className)}>
            <AvatarFallback className={cn(
                "bg-neutral-200 uppercase font-medium text-neutral-500 flex items-center justify-center",
                fallbackClassName
            )}>
                {name.charAt(0)}
            </AvatarFallback>
        </Avatar>

    );
}
