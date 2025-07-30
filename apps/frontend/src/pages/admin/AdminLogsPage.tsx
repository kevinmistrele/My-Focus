"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import type { ActivityLog } from "../../lib/types"
import {LogsService} from "../../services";

export const AdminLogsPage: React.FC = () => {
    const [logs, setLogs] = useState<ActivityLog[]>([])
    const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([])
    const [filter, setFilter] = useState<"all" | "user" | "task" | "pomodoro" | "system">("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [limit,] = useState(10)
    const [page, setPage] = useState(1)
    const [, setHasMore] = useState(true)
    const [totalLogs, setTotalLogs] = useState(0)

    const [logCountsByType, setLogCountsByType] = useState({
        user: 0,
        task: 0,
        pomodoro: 0,
        system: 0,
    })



    const fetchLogs = async (currentPage = 1) => {
        try {
            const response = await LogsService.getAll({ page: currentPage, limit })
            const { data, total, totalByType  } = response
            setTotalLogs(total)
            if (totalByType) setLogCountsByType(totalByType)


            const mappedLogs = data.map((log: any) => ({
                id: log.id,
                userId: log.userId,
                userName: log.userName || "Desconhecido",
                action: log.action || "",
                details: log.details || "",
                timestamp: new Date(log.timestamp),
                type: log.type || "user",
            }))

            setLogs((prev) => {
                const prevIds = new Set(prev.map((l) => l.id))
                const newUniqueLogs = mappedLogs.filter((l: ActivityLog) => !prevIds.has(l.id))
                const combined = [...prev, ...newUniqueLogs]
                setHasMore(combined.length < total)
                return combined
            })

            setHasMore(logs.length + mappedLogs.length < total)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs(1)
    }, [])

    useEffect(() => {
        let filtered = logs

        if (filter !== "all") {
            filtered = filtered.filter((log) => log.type === filter)
        }

        if (searchTerm.trim()) {
            filtered = filtered.filter((log) =>
                log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.details.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredLogs(filtered)
    }, [logs, filter, searchTerm])

    const getLogIcon = (type: string) => {
        switch (type) {
            case "user":
                return "👤"
            case "task":
                return "📝"
            case "pomodoro":
                return "⏰"
            case "system":
                return "⚙️"
            default:
                return "📊"
        }
    }

    const getLogColor = (type: string) => {
        switch (type) {
            case "user":
                return "text-blue-500"
            case "task":
                return "text-green-500"
            case "pomodoro":
                return "text-purple-500"
            case "system":
                return "text-orange-500"
            default:
                return "text-gray-500"
        }
    }

    const getLogBadgeColor = (type: string) => {
        switch (type) {
            case "user":
                return "bg-blue-500/20 text-blue-400"
            case "task":
                return "bg-green-500/20 text-green-400"
            case "pomodoro":
                return "bg-purple-500/20 text-purple-400"
            case "system":
                return "bg-orange-500/20 text-orange-400"
            default:
                return "bg-gray-500/20 text-gray-400"
        }
    }

    const formatTimeAgo = (timestamp: Date) => {
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return "Agora mesmo"
        if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
        return timestamp.toLocaleDateString("pt-BR")
    }

    const exportLogs = () => {
        const csvContent = [
            ["Data/Hora", "Usuário", "Ação", "Detalhes", "Tipo"],
            ...filteredLogs.map((log) => [
                log.timestamp.toLocaleString("pt-BR"),
                log.userName,
                log.action,
                log.details,
                log.type,
            ]),
        ]
            .map((row) => row.map((field) => `"${field}"`).join(","))
            .join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `logs_${new Date().toISOString().split("T")[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Logs de Atividade</h1>
                        <p className="text-secondary mt-1">Histórico de ações do sistema</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {[...Array(10)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <div className="h-16 bg-surface-light rounded"></div>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Logs de Atividade</h1>
                    <p className="text-secondary mt-1">Histórico de ações do sistema</p>
                </div>
                <Button onClick={exportLogs} variant="outline" className="bg-transparent">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    Exportar CSV
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{totalLogs}</div>
                        <div className="text-sm text-secondary">Total de Logs</div>
                    </div>
                </Card>
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">{logCountsByType.user}</div>
                        <div className="text-sm text-secondary">Usuário</div>
                    </div>
                </Card>
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{logCountsByType.task}</div>
                        <div className="text-sm text-secondary">Tarefas</div>
                    </div>
                </Card>
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-500">{logCountsByType.pomodoro}</div>
                        <div className="text-sm text-secondary">Pomodoro</div>
                    </div>
                </Card>
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">{logCountsByType.system}</div>
                        <div className="text-sm text-secondary">Sistema</div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                        placeholder="Buscar logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        }
                    />
                    <div className="flex space-x-2 flex-wrap">
                        {(["all", "user", "task", "pomodoro", "system"] as const).map((filterType) => (
                            <Button
                                key={filterType}
                                variant={filter === filterType ? "primary" : "ghost"}
                                size="sm"
                                onClick={() => setFilter(filterType)}
                            >
                                {filterType === "all"
                                    ? "Todos"
                                    : filterType === "user"
                                        ? "Usuário"
                                        : filterType === "task"
                                            ? "Tarefas"
                                            : filterType === "pomodoro"
                                                ? "Pomodoro"
                                                : "Sistema"}
                            </Button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Logs List */}
            <div className="space-y-3">
                {filteredLogs.map((log) => (
                    <Card key={log.id} className="hover:shadow-lg transition-shadow">
                        <div className="flex items-start space-x-4">
                            <div className={`text-2xl ${getLogColor(log.type)} mt-1`}>{getLogIcon(log.type)}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="font-medium text-primary truncate">{log.userName}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs ${getLogBadgeColor(log.type)}`}>
                    {log.type === "user"
                        ? "Usuário"
                        : log.type === "task"
                            ? "Tarefa"
                            : log.type === "pomodoro"
                                ? "Pomodoro"
                                : "Sistema"}
                  </span>
                                </div>
                                <p className="text-secondary text-sm mb-1">{log.action}</p>
                                <p className="text-muted text-xs">{log.details}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-muted text-xs">{formatTimeAgo(log.timestamp)}</p>
                                <p className="text-muted text-xs">{log.timestamp.toLocaleTimeString("pt-BR")}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredLogs.length === 0 && (
                <Card>
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-medium text-secondary mb-2">Nenhum log encontrado</h3>
                        <p className="text-muted">Tente ajustar os filtros ou termos de busca</p>
                    </div>
                </Card>
            )}

            {/* Load More */}
            {filteredLogs.length > 0 && (
                <div className="text-center">
                    <Button
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => {
                            const nextPage = page + 1
                            setPage(nextPage)
                            fetchLogs(nextPage)
                        }}
                    >
                        Carregar mais logs
                    </Button>
                </div>
            )}
        </div>
    )
}
