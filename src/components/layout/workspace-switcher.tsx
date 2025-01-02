"use client";

import {
    ResponseGetWorkspace,
    useGetWorkspaces,
} from "@/features/workspaces/api/use-get-workspace";
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import { RiAddCircleFill } from "react-icons/ri";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
export default function WorkspaceSwitcher() {
  const { data: workspaces } = useGetWorkspaces();

  return (
    <div className="flex flex-col gap-y-2 mb-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" />
      </div>
      <SelectionWorkspaces data={workspaces?.documents || []} />
    </div>
  );
}

function SelectionWorkspaces({
  data,
}: {
  data: ResponseGetWorkspace["data"]["documents"];
}) {
  return (
    <Select>
      <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
        <SelectValue placeholder="Select a workspace" />
      </SelectTrigger>
      <SelectContent>
        {data.map((workspace) => (
          <SelectItem key={workspace.$id} value={workspace.$id}>
            <WorkspaceAvatar image={workspace.imageUrl} name={workspace.name} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
WorkspaceSwitcher.displayName = "WorkspaceSwitcher";
