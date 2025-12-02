import type React from "react"
import {DashboardPage} from "../pages/DashboardPage"
import {TasksPage} from "../pages/TasksPage"
import {GoalsPage} from "../pages/GoalsPage"
import {HabitsPage} from "../pages/HabitsPage"
import {NotesPage} from "../pages/NotesPage"
import {ProfilePage} from "../pages/ProfilePage"
import {PomodoroPage} from "../pages/PomodoPage"
import {AdminDashboardPage} from "../pages/admin/AdminDashboardPage"
import {AdminUsersPage} from "../pages/admin/AdminUsersPage"
import {AdminLogsPage} from "../pages/admin/AdminLogsPage"
import type {Route} from "../lib/router"
import type {User} from "../lib/types"
import {QuotesPage} from "../pages/QuotesPage.tsx";
import {MoodPage} from "../pages/MoodPage.tsx";
import {NewsPage} from "../pages/NewsPage.tsx";

interface RouterProps {
    currentPath: Route
    onNavigate: (path: string) => void
    user?: User
}

// Componente Router para navegação entre páginas
export const Router: React.FC<RouterProps> = ({ currentPath, onNavigate, user }) => {
    const isAdmin = user?.type === "admin"

    // Função para renderizar a página atual com base no caminho
    const renderCurrentPage = () => {
        switch (currentPath) {
            case "/dashboard":
                return <DashboardPage onNavigate={onNavigate} />
            case "/tasks":
                return <TasksPage />
            case "/pomodoro":
                return <PomodoroPage />
            case "/goals":
                return <GoalsPage />
            case "/habits":
                return <HabitsPage />
            case "/quotes":
                return <QuotesPage />
            case "/mood":
                return <MoodPage />
            case "/notes":
                return <NotesPage />
            case "/news":
                return <NewsPage/>
            case "/profile":
                return <ProfilePage />
            case "/admin/dashboard":
                return isAdmin ? <AdminDashboardPage onNavigate={onNavigate} /> : <UnauthorizedPage />
            case "/admin/users":
                return isAdmin ? <AdminUsersPage /> : <UnauthorizedPage />
            case "/admin/logs":
                return isAdmin ? <AdminLogsPage /> : <UnauthorizedPage />
            case "/calendar":
                return (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📅</div>
                        <h2 className="text-2xl font-bold text-primary mb-2">Calendário</h2>
                        <p className="text-secondary">Em desenvolvimento...</p>
                    </div>
                )
            case "/analytics":
                return (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📊</div>
                        <h2 className="text-2xl font-bold text-primary mb-2">Relatórios</h2>
                        <p className="text-secondary">Em desenvolvimento...</p>
                    </div>
                )
            case "/settings":
                return (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">⚙️</div>
                        <h2 className="text-2xl font-bold text-primary mb-2">Configurações</h2>
                        <p className="text-secondary">Em desenvolvimento...</p>
                    </div>
                )
            default:
                return <DashboardPage onNavigate={onNavigate} />
        }
    }

    return <>{renderCurrentPage()}</>
}

// Página para acesso não autorizado
const UnauthorizedPage: React.FC = () => (
    <div className="text-center py-20">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-primary mb-2">Acesso Negado</h2>
        <p className="text-secondary">Você não tem permissão para acessar esta página.</p>
    </div>
)
