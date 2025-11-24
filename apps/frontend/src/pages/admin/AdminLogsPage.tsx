import type React from "react"
import {useEffect, useState} from "react"
import {Card} from "../../components/ui/Card"
import {Button} from "../../components/ui/Button"
import type {ActivityLog} from "../../lib/types"
import {LogsService} from "../../services"

type LogFilter = "all" | "user" | "task" | "pomodoro" | "system"

export const AdminLogsPage: React.FC = () => {
    const [, setLogs] = useState<ActivityLog[]>([])
    const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([])
    const [filter, setFilter] = useState<LogFilter>("all")
    const [isLoading, setIsLoading] = useState(true)
    const [limit] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalLogs, setTotalLogs] = useState(0)

    const [logCountsByType, setLogCountsByType] = useState({
        user: 0,
        task: 0,
        pomodoro: 0,
        system: 0,
    })

    const fetchLogs = async (page = 1, currentFilter: LogFilter = "all") => {
        setIsLoading(true)

        try {
            const res = await LogsService.getAll({
                page,
                limit,
                // manda o type só se não for "all"
                type: currentFilter === "all" ? undefined : currentFilter,
            })

            const {data, totalPages, total, totalByType} = res

            setTotalPages(totalPages)
            setTotalLogs(total)
            setLogCountsByType(totalByType)

            const mapped: ActivityLog[] = data.map((log: any) => ({
                id: log.id,
                userId: log.userId,
                userName: log.userName || "Desconhecido",
                action: log.action || "",
                details: log.details || "",
                timestamp: new Date(log.timestamp),
                type: log.type || "user",
            }))

            setLogs(mapped)
            setFilteredLogs(mapped) // agora os "logs filtrados" já vêm do backend
        } finally {
            setIsLoading(false)
        }
    }

    // sempre que página ou filtro mudar, busca de novo
    useEffect(() => {
        fetchLogs(currentPage, filter)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, filter])

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
        const diffInMinutes = Math.floor(
            (now.getTime() - timestamp.getTime()) / (1000 * 60),
        )

        if (diffInMinutes < 1) return "Agora mesmo"
        if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
        return timestamp.toLocaleDateString("pt-BR")
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">
                            Logs de Atividade
                        </h1>
                        <p className="text-secondary mt-1">
                            Histórico de ações do sistema
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {[...Array(10)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <div className="h-16 bg-surface-light rounded"/>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Logs de Atividade</h1>
                    <p className="text-secondary mt-1">
                        Histórico de ações do sistema
                    </p>
                </div>
            </div>

            {/* Stats gerais (globais) */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{totalLogs}</div>
                        <div className="text-sm text-secondary">Total de Logs</div>
                    </div>
                </Card>
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">
                            {logCountsByType.user}
                        </div>
                        <div className="text-sm text-secondary">Usuário</div>
                    </div>
                </Card>
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">
                            {logCountsByType.task}
                        </div>
                        <div className="text-sm text-secondary">Tarefas</div>
                    </div>
                </Card>
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-500">
                            {logCountsByType.pomodoro}
                        </div>
                        <div className="text-sm text-secondary">Pomodoro</div>
                    </div>
                </Card>
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">
                            {logCountsByType.system}
                        </div>
                        <div className="text-sm text-secondary">Sistema</div>
                    </div>
                </Card>
            </div>

            {/* Filtros (sem busca) */}
            <Card>
                <div className="flex flex-wrap gap-2">
                    {(["all", "user", "task", "pomodoro", "system"] as const).map(
                        (filterType) => (
                            <Button
                                key={filterType}
                                variant={filter === filterType ? "primary" : "ghost"}
                                size="sm"
                                onClick={() => {
                                    setCurrentPage(1) // sempre volta pra primeira página ao trocar filtro
                                    setFilter(filterType)
                                }}
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
                        ),
                    )}
                </div>
            </Card>

            {/* Lista de logs */}
            <div className="space-y-3">
                {filteredLogs.map((log) => (
                    <Card key={log.id} className="hover:shadow-lg transition-shadow">
                        <div className="flex items-start space-x-4">
                            <div className={`text-2xl ${getLogColor(log.type)} mt-1`}>
                                {getLogIcon(log.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="font-medium text-primary truncate">
                                        {log.userName}
                                    </h3>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${getLogBadgeColor(
                                            log.type,
                                        )}`}
                                    >
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
                                <p className="text-muted text-xs">
                                    {formatTimeAgo(log.timestamp)}
                                </p>
                                <p className="text-muted text-xs">
                                    {log.timestamp.toLocaleTimeString("pt-BR")}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredLogs.length === 0 && (
                <Card>
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-medium text-secondary mb-2">
                            Nenhum log encontrado
                        </h3>
                        <p className="text-muted">
                            Tente ajustar o filtro selecionado
                        </p>
                    </div>
                </Card>
            )}

            {/* Paginação */}
            {filteredLogs.length > 0 && (
                <div className="flex justify-center mt-6 space-x-2">
                    <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    >
                        Anterior
                    </Button>

                    <span className="text-primary px-4 pt-2">
            Página {currentPage} de {totalPages}
          </span>

                    <Button
                        disabled={currentPage === totalPages}
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                    >
                        Próxima
                    </Button>
                </div>
            )}
        </div>
    )
}
