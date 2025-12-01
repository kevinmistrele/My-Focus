import type React from "react"
import {useCallback, useEffect, useState} from "react"
import {Card} from "../components/ui/Card"
import {Button} from "../components/ui/Button"
import {Input} from "../components/ui/Input"
import {formatTime} from "../lib/utils"
import {PomodoroService} from "../services"
import {toast} from "sonner"

const STORAGE_KEY = "myfocus:pomodoro"

export const PomodoroPage: React.FC = () => {
    const [customMinutes, setCustomMinutes] = useState(25)
    const [timeLeft, setTimeLeft] = useState(25 * 60) // base
    const [isActive, setIsActive] = useState(false)
    const [startTime, setStartTime] = useState<number | null>(null)
    const [hydrated, setHydrated] = useState(false)

    const [sessions, setSessions] = useState(0)
    const [sessionHistory, setSessionHistory] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalMinutes, setTotalMinutes] = useState(0)
    const [isEditing, setIsEditing] = useState(false)
    const [draftMinutes, setDraftMinutes] = useState<string>("" + customMinutes)

    useEffect(() => {
        if (isEditing) setDraftMinutes(String(customMinutes))
    }, [isEditing, customMinutes])


    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
            try {
                const saved = JSON.parse(raw) as {
                    customMinutes?: number
                    startTime?: number | null
                    isActive?: boolean
                }

                if (typeof saved.customMinutes === "number") {
                    setCustomMinutes(saved.customMinutes)
                    setTimeLeft(saved.customMinutes * 60)
                }

                if (saved.startTime && saved.isActive) {
                    const elapsed = Math.floor((Date.now() - saved.startTime) / 1000)
                    const total = (saved.customMinutes ?? 25) * 60
                    const remaining = total - elapsed
                    if (remaining > 0) {
                        setStartTime(saved.startTime)
                        setTimeLeft(remaining)
                        setIsActive(true)
                    } else {
                        setStartTime(null)
                        setIsActive(false)
                        setTimeLeft((saved.customMinutes ?? 25) * 60)
                    }
                }
            } catch {}
        }
        setHydrated(true)
    }, [])

    useEffect(() => {
        if (!hydrated) return
        const prev = (() => {
            try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") } catch { return {} }
        })()
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ ...prev, customMinutes, startTime, isActive })
        )
    }, [customMinutes, startTime, isActive, hydrated])

    useEffect(() => {
        if (!isActive || !startTime) return

        const tick = () => {
            const now = Date.now()
            const elapsed = Math.floor((now - startTime) / 1000)
            const remaining = customMinutes * 60 - elapsed

            if (remaining <= 0) {
                setIsActive(false)
                setStartTime(null)
                setTimeLeft(0)

                const prev = (() => {
                    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") } catch { return {} }
                })()
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({ ...prev, isActive: false, startTime: null })
                )
            } else {
                setTimeLeft(remaining)
            }
        }

        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [isActive, startTime, customMinutes])

    const fetchSessions = useCallback(async () => {
        try {
            const res = await PomodoroService.getAll({ page: currentPage, limit: 5 })
            const { data, total, totalDuration, totalPages } = res

            const mapped = data.map((s: any) => {
                const start = new Date(s.startTime)
                const end = new Date(start.getTime() + s.duration * 60 * 1000)
                return {
                    id: s.id,
                    date: start,
                    duration: s.duration,
                    completed: true,
                    startTime: start,
                    endTime: end,
                }
            })

            setSessionHistory(mapped)
            setSessions(total)
            setTotalMinutes(totalDuration)
            setTotalPages(totalPages)
        } catch {
            toast.error("Erro ao carregar sessões do Pomodoro.")
        }
    }, [currentPage])

    useEffect(() => {
        fetchSessions()
    }, [fetchSessions])

    useEffect(() => {
        const onCompleted = () => {
            setIsActive(false)
            setStartTime(null)
            setTimeLeft(customMinutes * 60)
            fetchSessions()
        }
        window.addEventListener("pomodoro:completed", onCompleted as EventListener)
        return () => window.removeEventListener("pomodoro:completed", onCompleted as EventListener)
    }, [customMinutes, fetchSessions])

    const handleStart = () => {
        if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
            Notification.requestPermission()
        }
        setStartTime(Date.now() - (customMinutes * 60 - timeLeft) * 1000)
        setIsActive(true)
    }

    const handlePause = () => {
        setIsActive(false)
        setStartTime(null)
    }

    const handleReset = () => {
        setIsActive(false)
        setStartTime(null)
        setTimeLeft(customMinutes * 60)
    }

    const applyMinutes = () => {
        const n = Number(draftMinutes)
        if (!draftMinutes || Number.isNaN(n)) {
            setIsEditing(false)
            return
        }
        const clamped = Math.max(1, Math.min(120, n))
        handleTimeChange(clamped)
        setIsEditing(false)
    }

    const handleTimeChange = (minutes: number) => {
        if (minutes > 0 && minutes <= 120) {
            setCustomMinutes(minutes)
            if (!isActive) {
                setTimeLeft(minutes * 60)
                setStartTime(null)
            }
        }
    }

    const progress = ((customMinutes * 60 - timeLeft) / (customMinutes * 60)) * 100

    if (!hydrated) {
        return <div className="text-center text-secondary mt-10">Recuperando pomodoro...</div>
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-primary mb-2">Timer de Foco</h1>
                <p className="text-secondary">Mantenha o foco e seja mais produtivo</p>
            </div>

            {/* Timer Display */}
            <Card className="text-center" padding="lg">
                <div className="relative mb-8">
                    <svg className="w-80 h-80 mx-auto transform -rotate-90">
                        <circle cx="160" cy="160" r="140" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-surface-light" />
                        <circle
                            cx="160" cy="160" r="140" stroke="currentColor" strokeWidth="12" fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 140}`}
                            strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
                            className="text-primary transition-all duration-1000 ease-linear"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-7xl font-bold text-primary mb-4">{formatTime(timeLeft)}</div>
                            <div className="text-lg text-secondary">{isActive ? "Focando..." : "Pronto para focar"}</div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center space-x-4 mb-6">
                    <Button onClick={isActive ? handlePause : handleStart} size="lg" className="px-8">
                        {isActive ? "Pausar" : "Iniciar"}
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="lg">
                        Resetar
                    </Button>
                </div>

                {/* Time Editor */}
                <div className="flex items-center justify-center space-x-4">
                    <span className="text-secondary">Duração:</span>
                    {isEditing ? (
                        <div className="flex items-center space-x-2">
                            <Input
                                type="text"                 // evita quirks do type="number"
                                inputMode="numeric"         // mostra teclado numérico no mobile
                                pattern="\d*"
                                value={draftMinutes}
                                onChange={(e) =>
                                    setDraftMinutes(e.target.value.replace(/[^\d]/g, "")) // só dígitos
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") applyMinutes()
                                    if (e.key === "Escape") setIsEditing(false)
                                }}
                                className="w-20 text-center"
                                placeholder="min"
                            />
                            <span className="text-secondary">min</span>
                            <Button size="sm" onClick={applyMinutes}>OK</Button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                            disabled={isActive}
                        >
                            <span className="font-medium">{customMinutes} min</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    )}
                </div>
            </Card>

            {/* Quick Time Presets */}
            <Card>
                <h3 className="text-lg font-medium text-primary mb-4 text-center">Tempos Rápidos</h3>
                <div className="flex justify-center space-x-2 flex-wrap gap-2">
                    {[15, 25, 30, 45, 60].map((minutes) => (
                        <Button
                            key={minutes}
                            variant={customMinutes === minutes ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => handleTimeChange(minutes)}
                            disabled={isActive}
                        >
                            {minutes}min
                        </Button>
                    ))}
                </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{sessions}</div>
                        <div className="text-sm text-secondary">Sessões Completas</div>
                    </div>
                </Card>
                <Card padding="sm">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-500">
                            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}
                        </div>
                        <div className="text-sm text-secondary">Tempo Total</div>
                    </div>
                </Card>
            </div>

            {/* Session History */}
            <Card>
                <h3 className="text-lg font-medium text-primary mb-4">Histórico de Sessões</h3>
                {sessionHistory.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-2">🍅</div>
                        <p className="text-secondary">Nenhuma sessão registrada ainda</p>
                        <p className="text-muted text-sm">Complete sua primeira sessão para ver o histórico</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {sessionHistory.slice(0, 10).map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-3 bg-surface-light rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <div>
                                        <div className="text-sm font-medium text-primary">{session.duration} minutos</div>
                                    </div>
                                </div>
                                <div className="text-xs text-secondary">
                                    {session.date.toLocaleDateString("pt-BR") === new Date().toLocaleDateString("pt-BR")
                                        ? "Hoje"
                                        : session.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 px-2">
                    <Button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                        Anterior
                    </Button>
                    <span className="text-sm text-secondary">Página {currentPage} de {totalPages}</span>
                    <Button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                        Próxima
                    </Button>
                </div>
            )}
        </div>
    )
}
