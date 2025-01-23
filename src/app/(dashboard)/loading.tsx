import { Loader } from "lucide-react";

export default function DashboardLoading(){
    return <div className="min-h-screen flex items-center justify-center">
        <Loader className="size-6 a animate-spin text-muted-foreground"/>
    </div>
}