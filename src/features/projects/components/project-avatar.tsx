import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ProjectAvatar({
  image,
  name,
  className,
  fallbackClassName,
  textClassName,
  showText = true
}: {
  image?: string;
  name: string;
  className?: string;
  textClassName?: string;
  fallbackClassName?: string;
  showText?:boolean
}) {
  return (
    <div className="flex justify-start items-center gap-3 font-medium">
      {image ? (
        <div
          className={cn(
            "relative size-5 rounded-md overflow-hidden",
            className
          )}
        >
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
      ) : (
        <Avatar className={cn("size-5 !rounded-sm", className)}>
          <AvatarFallback
            className={cn(
              "text-white bg-blue-600 font-semibold !text-[12px] uppercase !rounded-sm",
              fallbackClassName
            )}
          >
            {name[0]}
          </AvatarFallback>
        </Avatar>
      )}
      {showText && <span className={cn("truncate text-sm",textClassName)}>{name}</span>}
    </div>
  );
}
