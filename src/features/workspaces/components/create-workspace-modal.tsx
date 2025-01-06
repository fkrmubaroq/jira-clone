"use client"
import ResponsiveModal from "@/components/responsive-modal";
import CreateWorkspaceForm from "./create-workspace-form";

export default function CreateWorkspaceModal(){
    return <ResponsiveModal open onOpenChange={() => ""}>
        <CreateWorkspaceForm />
    </ResponsiveModal>
}