import {useState} from "react"
import {Header} from "./components/layout/Header"
import {Sidebar} from "./components/layout/Sidebar"
import {Router} from "./components/Router"
import {LoginPage} from "./pages/LoginPage"
import type {Route} from "./lib/router"
import "./styles/global.css"
import {useAuth} from "./contexts/AuthContext"
import {PomodoroWatcher} from "./components/PomodoroWatcher.tsx";

// Componente principal da aplicação
export default function App() {
    const { user, loading, login } = useAuth()
    const [currentPath, setCurrentPath] = useState<Route>("/dashboard")
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Função para navegar entre páginas
    const handleNavigate = (path: string) => {
        setCurrentPath(path as Route)
        setSidebarOpen(false)
    }

    if (loading) return null

    // Se o usuário não estiver autenticado, exibe a página de login
    if (!user) {
        return <LoginPage onLogin={(user, token) => login(user, token)} />
    }

    return (
        <div className="min-h-screen bg-background flex">
            <PomodoroWatcher />
            <Sidebar
                isOpen={sidebarOpen}
                currentPath={currentPath}
                onNavigate={handleNavigate}
                user={user}
            />

            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
                <Header user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        <Router currentPath={currentPath} onNavigate={handleNavigate} user={user} />
                    </div>
                </main>
            </div>
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    )
}

