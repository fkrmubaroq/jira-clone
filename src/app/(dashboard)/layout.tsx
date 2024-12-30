
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen">
        <div className="flex w-full h-full">
            <div className="lg:pl-[264px]">
                <div className="mx-auto max-w-screen-2xl h-full">
                    <main>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    </div>
}