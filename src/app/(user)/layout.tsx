import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen">
        <CreateWorkspaceModal />
        <div className="flex w-full h-full">
            <div className="fixed left-0 top- hidden lg:block lg:w-[264px] h-full overflow-y-auto">
                <Sidebar />
            </div>
            <div className="lg:pl-[264px] w-full">
                <div className="mx-auto max-w-screen-2xl h-full">
                    <Navbar />
                    <main className="h-full py-8 px-6 flex flex-col">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    </div>
}