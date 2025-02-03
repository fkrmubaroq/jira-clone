"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceId } from "../api/use-workspace-id"
import { Separator } from "@/components/ui/separator";
import { ResponseGetMembers, useGetMembers } from "@/features/members/api/user-get-members";
import React from "react";
import MemberAvatar from "@/features/members/components/member-avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberRole } from "@/features/members/types";
import { useModal } from "@/hooks/use-modal";
import ModalConfirmation from "./modal-confirmation";
import { useCurrent } from "@/features/auth/api/use-current";

export default function MembersList() {
    const workspaceId = useWorkspaceId();
    const { data } = useGetMembers({ workspaceId });
    const { show, data: dataModal, showModal, hideModal } = useModal<"confirmation-delete-member", string>();
    const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();
    const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();

    const handleUpdateMember = (memberId: string, role: MemberRole) => {
        updateMember({
            json: { role },
            param: { memberId }
        })
    }

    const confirmDelete = () => {
        if (!dataModal) return;
        deleteMember({ param: { memberId: dataModal } },
            {
                onSettled: () => {
                    hideModal();
                }
            }
        )
    }
    return <>
        <ModalConfirmation
            title="Remove Member"
            message="This member will be removed from the workspace"
            variant="destructive"
            isLoading={isDeletingMember}
            onConfirm={confirmDelete}
            show={show}
            onHide={hideModal}
        />

        <Button asChild variant="ghost" className="pl-0 mb-2">
            <Link href={`/workspaces/${workspaceId}`}>
                <ArrowLeftIcon className="size-4 mr-2" />
                Back
            </Link>
        </Button>

        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 space-y-0">
                <CardTitle className="text-xl font-bold">Members list</CardTitle>
                <div className="px-7">
                    <Separator />
                </div>
            </CardHeader>

            <CardContent>
                {data?.documents.map((member, index) => <React.Fragment key={member.$id}>
                    <div className="flex items-center gap-2">
                        <MemberAvatar
                            className="size-10"
                            fallbackClassName="text-lg"
                            name={member.name}
                        />
                        <div className="flex flex-col">
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                        <DropdownAction
                            onUpdate={handleUpdateMember}
                            onRemove={(memberId) => showModal("confirmation-delete-member", memberId)}
                            isUpdating={isUpdatingMember}
                            isDeleting={isDeletingMember}
                            member={member}
                        />

                    </div>
                    {index < data.documents.length - 1 && <Separator className="my-2.5 !bg-gray-100" />}
                </React.Fragment>)}
            </CardContent>
        </Card>
    </>
}

function DropdownAction({ onUpdate, onRemove, isUpdating, isDeleting, member }: {
    onUpdate: (memberId: string, role: MemberRole) => void,
    onRemove: (memberId: string) => void,
    isUpdating: boolean,
    isDeleting: boolean,
    member: ResponseGetMembers["data"]["documents"][0]
}) {
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className="ml-auto" variant="ghost" size="icon">
                <MoreVerticalIcon />
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem
                className="font-medium cursor-pointer"
                onClick={() => onUpdate(member.$id, MemberRole.ADMIN)}
                disabled={isUpdating}
            >
                Set as Administrator
            </DropdownMenuItem>
            <DropdownMenuItem
                className="font-medium cursor-pointer"
                onClick={() => onUpdate(member.$id, MemberRole.MEMBER)}
                disabled={isUpdating}
            >
                Set as Member
            </DropdownMenuItem>
            <DropdownMenuItem
                className="font-medium cursor-pointer text-amber-700"
                onClick={() => onRemove(member.$id)}
                disabled={isDeleting}
            >
                Remove {member.name}
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}