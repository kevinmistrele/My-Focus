// src/components/layout/AuthenticatedLayout.tsx
import { Header } from "../layout/Header"
import { Sidebar } from "../layout/Sidebar"
import { Router } from "../Router"
import type {User} from "../../lib/types.ts";
import type {Route} from "../../lib/router.ts";

interface Props {
    user: User
    currentPath: Route
    onNavigate: (path: string) => void
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
}

export function AuthenticatedLayout({
                                        user,
                                        currentPath,
                                        onNavigate,
                                        sidebarOpen,
                                        setSidebarOpen,
                                    }: Props) {
    return (
        <div className="min-h-screen bg-background text-text-primary dark:bg-darkBackground dark:text-text-light">
        <Header user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex">
                <Sidebar isOpen={sidebarOpen} currentPath={currentPath} onNavigate={onNavigate} />

                <main className="flex-1 p-6 lg:ml-0">
                    <div className="max-w-7xl mx-auto">
                        <Router currentPath={currentPath} onNavigate={onNavigate} />
                    </div>
                </main>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    )
}
