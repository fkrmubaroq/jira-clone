import { getCurrent } from "@/features/auth/queries";

export default async function TaskIdPage({ }){
    const user = await getCurrent();
    return <div></div>
}