"use client";

import {
  ResponseGetWorkspace,
  useGetWorkspaces,
} from "@/features/workspaces/api/use-get-workspace";
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import useCreateWorkspaceModal from "@/features/workspaces/hooks/use-create-workspace-modal";
import { useParams, useRouter } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function WorkspaceSwitcher() {
  const { open } = useCreateWorkspaceModal();
  const { data: workspaces } = useGetWorkspaces();
  const router = useRouter();
  const onSelectWorkspace = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`);
  };
  return (
    <div className="flex flex-col gap-y-2 mb-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          onClick={open}
        />
      </div>
      <SelectionWorkspaces data={workspaces?.documents || []} onSelect={onSelectWorkspace} />
    </div>
  );
}

function SelectionWorkspaces({
  data,
  onSelect
}: {
  data: ResponseGetWorkspace["data"]["documents"];
  onSelect: (value: string) => void
}) {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  return (
    <Select onValueChange={onSelect} value={workspaceId}>
      <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
        <SelectValue placeholder="Select a workspace" />
      </SelectTrigger>
      <SelectContent>
        {data.length ? data.map((workspace) => (
          <SelectItem key={workspace.$id} value={workspace.$id}>
            <WorkspaceAvatar image={workspace.imageUrl} name={workspace.name} />
          </SelectItem>
        )) : <div className="text-xs flex justify-center items-center text-neutral-400 p-5">No workspaces</div>}
      </SelectContent>
    </Select>
  );
}
WorkspaceSwitcher.displayName = "WorkspaceSwitcher";
