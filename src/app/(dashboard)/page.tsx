import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";

async function Home() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div>
  This is a home page
    </div>
  );
}
export default Home;