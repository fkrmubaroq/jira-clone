import { getCurrent } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";

export default async function ProjectIdSettingsPage({
  params,
}: {
  params: {
    projectId: string;
  };
}) {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getProject({
    projectId: params.projectId,
  });


  return <div className="w-full lg:max-w-xl">
    
  </div>;
}
