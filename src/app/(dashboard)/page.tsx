import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

async function Home() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const workspaces = await getWorkspaces();
  if(!workspaces?.total) redirect("/workspaces/create");
  else redirect(`/workspaces/${workspaces.documents[0].$id}`)

}
export default Home;