export type Route =
    | "/dashboard"
    | "/tasks"
    | "/pomodoro"
    | "/goals"
    | "/habits"
    | "/notes"
    | "/profile"
    | "/preferences"
    | "/calendar"
    | "/analytics"
    | "/settings"
    | "/admin/dashboard"
    | "/admin/users"
    | "/admin/logs"

export interface RouteConfig {
    path: Route
    label: string
    icon: string
    component?: string
    adminOnly?: boolean
}

export const routes: RouteConfig[] = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/tasks", label: "Tarefas", icon: "📝" },
    { path: "/pomodoro", label: "Pomodoro", icon: "⏰" },
    { path: "/goals", label: "Metas", icon: "🎯" },
    { path: "/habits", label: "Hábitos", icon: "⚡" },
    { path: "/notes", label: "Anotações", icon: "📄" },
    { path: "/profile", label: "Perfil", icon: "👤" },
    { path: "/preferences", label: "Preferências", icon: "⚙️" },
]

export const adminRoutes: RouteConfig[] = [
    { path: "/admin/dashboard", label: "Admin Dashboard", icon: "📊", adminOnly: true },
    { path: "/admin/users", label: "Usuários", icon: "👥", adminOnly: true },
    { path: "/admin/logs", label: "Logs", icon: "📋", adminOnly: true },
]

export const navigateTo = (path: Route, onNavigate: (path: string) => void) => {
    onNavigate(path)
}
