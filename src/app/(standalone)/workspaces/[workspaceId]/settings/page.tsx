import { getWorkspace } from "@/features/workspaces/actions";
import EditWorkspaceForm from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";

type WorkspaceIdSettingProps = {
  params: {
    workspaceId: string;
  };
};
export default async function WorkspaceIdSettingPage({
  params,
}: WorkspaceIdSettingProps) {

  const initialValues = await getWorkspace({ workspaceId: params.workspaceId });
  if (!initialValues) {
    redirect(`/workspace/${params.workspaceId}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues}/>
    </div>
  );
}
