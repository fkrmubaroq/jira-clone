
import Image from "next/image";
import Link from "next/link";
import { Separator } from "../ui/separator";
import Navigation from "./navigation";
import WorkspaceSwitcher from "./workspace-switcher";

export default function Sidebar() {
    return <aside className="h-full bg-neutral-100 p-4 w-full">
        <Link href="/" className="flex items-center gap-x-1">
            <Image src="/logo.svg" alt="logo" width={32} height={32} />
            <span className="font-semibold">Jira Clone</span>
        </Link>
        <Separator className="my-5" />
        <WorkspaceSwitcher />
        <Navigation />
    </aside>
}