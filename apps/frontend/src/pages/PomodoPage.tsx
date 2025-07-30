"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { formatTime } from "../lib/utils"
import {PomodoroService} from "../services";
import {toast} from "sonner";

export const PomodoroPage: React.FC = () => {
    const [customMinutes, setCustomMinutes] = useState(25)
    const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
    const [isActive, setIsActive] = useState(false)
    const [sessions, setSessions] = useState(0)
    const [isEditing, setIsEditing] = useState(false)
    const [sessionHistory, setSessionHistory] = useState<any[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalMinutes, setTotalMinutes] = useState(0)

    useEffect(() => {
        const fetchSessions = async () => {
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
            } catch (err) {
                toast.error("Erro ao carregar sessões do Pomodoro.")
            }
        }

        fetchSessions()
    }, [currentPage])



    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((timeLeft) => timeLeft - 1)
            }, 1000)
        } else if (timeLeft === 0 && isActive) {
            const handleSessionComplete = async () => {
                setIsActive(false)
                setSessions((prev) => prev + 1)
                setTimeLeft(customMinutes * 60)

                const now = new Date()
                const start = new Date(now.getTime() - customMinutes * 60 * 1000)

                const payload = {
                    duration: customMinutes,
                    type: "work" as const,
                    startTime: start,
                }

                try {
                    const saved = await PomodoroService.create(payload)

                    setSessionHistory((prev) => [
                        {
                            id: saved.id,
                            date: new Date(saved.startTime),
                            duration: saved.duration,
                            completed: true,
                            startTime: new Date(saved.startTime),
                            endTime: new Date(),
                        },
                        ...prev,
                    ])

                    if (Notification.permission === "granted") {
                        new Notification("MyFocus", {
                            body: "Sessão de foco concluída! 🎉",
                            icon: "/favicon.ico",
                        })
                    }
                } catch (err) {
                    toast.error("Erro ao salvar sessão do Pomodoro.")
                }
            }

            handleSessionComplete()
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, timeLeft, customMinutes])

    const handleStart = () => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission()
        }
        setIsActive(true)
    }

    const handlePause = () => setIsActive(false)

    const handleReset = () => {
        setIsActive(false)
        setTimeLeft(customMinutes * 60)
    }

    const handleTimeChange = (minutes: number) => {
        if (minutes > 0 && minutes <= 120) {
            setCustomMinutes(minutes)
            if (!isActive) {
                setTimeLeft(minutes * 60)
            }
        }
    }

    const progress = ((customMinutes * 60 - timeLeft) / (customMinutes * 60)) * 100


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
                        <circle
                            cx="160"
                            cy="160"
                            r="140"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-surface-light"
                        />
                        <circle
                            cx="160"
                            cy="160"
                            r="140"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
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
                        {isActive ? (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Pausar
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Iniciar
                            </>
                        )}
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="lg">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        Resetar
                    </Button>
                </div>

                {/* Time Editor */}
                <div className="flex items-center justify-center space-x-4">
                    <span className="text-secondary">Duração:</span>
                    {isEditing ? (
                        <div className="flex items-center space-x-2">
                            <Input
                                type="number"
                                value={customMinutes}
                                onChange={(e) => handleTimeChange(Number.parseInt(e.target.value) || 25)}
                                className="w-20 text-center"
                                min="1"
                                max="120"
                            />
                            <span className="text-secondary">min</span>
                            <Button size="sm" onClick={() => setIsEditing(false)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </Button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                            disabled={isActive}
                        >
                            <span className="font-medium">{customMinutes} min</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
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
                                        <div className="text-xs text-muted">
                                            {session.startTime.toLocaleTimeString("pt-BR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}{" "}
                                            -{" "}
                                            {session.endTime.toLocaleTimeString("pt-BR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
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
                    <span className="text-sm text-secondary">
            Página {currentPage} de {totalPages}
        </span>
                    <Button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                        Próxima
                    </Button>
                </div>
            )}

        </div>
    )
}
