import type React from "react"
import { useLocation, Link } from "react-router-dom"

interface SidebarItem {
  label: string
  path: string
  icon: string
}

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: "📊" },
  { label: "Tasks", path: "/tasks", icon: "✅" },
  { label: "Pomodoro", path: "/pomodoro", icon: "🍅" },
  { label: "Goals", path: "/goals", icon: "🎯" },
  { label: "Habits", path: "/habits", icon: "🔄" },
  { label: "Notes", path: "/notes", icon: "📝" },
  { label: "Profile", path: "/profile", icon: "👤" },
  { label: "Preferences", path: "/preferences", icon: "⚙️" },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
