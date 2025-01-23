import EditWorkspaceForm from "@/features/workspaces/components/edit-workspace-form";
import { getWorkspace } from "@/features/workspaces/queries";
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
    redirect(`/workspaces/${params.workspaceId}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues}/>
    </div>
  );
}
