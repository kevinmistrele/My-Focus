"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"

export const PreferencesPage: React.FC = () => {
    const [preferences, setPreferences] = useState({
        language: "pt-BR",
        notifications: {
            pomodoroEnd: true,
            taskReminders: true,
            dailyGoals: false,
            weeklyReports: true,
        },
        general: {
            startWeekOn: "monday",
            timeFormat: "24h",
            autoStartBreaks: false,
            soundEnabled: true,
        },
    })

    const updatePreference = (category: string, key: string, value: any) => {
        setPreferences((prev) => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [key]: value,
            },
        }))
    }

    const languages = [
        { value: "pt-BR", label: "Português (Brasil)", flag: "🇧🇷" },
        { value: "en-US", label: "English (US)", flag: "🇺🇸" },
        { value: "es-ES", label: "Español", flag: "🇪🇸" },
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Preferências</h1>
                    <p className="text-secondary mt-1">Personalize sua experiência</p>
                </div>
            </div>

            {/* Notifications */}
            <Card>
                <h2 className="text-xl font-semibold text-primary mb-4">Notificações</h2>

                <div className="space-y-4">
                    {[
                        { key: "pomodoroEnd", label: "Fim do Pomodoro", description: "Notificar quando uma sessão terminar" },
                        {
                            key: "taskReminders",
                            label: "Lembretes de Tarefas",
                            description: "Lembrar de tarefas com prazo próximo",
                        },
                        { key: "dailyGoals", label: "Metas Diárias", description: "Resumo diário do seu progresso" },
                        { key: "weeklyReports", label: "Relatórios Semanais", description: "Relatório semanal de produtividade" },
                    ].map((notification) => (
                        <div key={notification.key} className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                            <div>
                                <h4 className="font-medium text-primary">{notification.label}</h4>
                                <p className="text-sm text-secondary">{notification.description}</p>
                            </div>
                            <button
                                onClick={() =>
                                    updatePreference(
                                        "notifications",
                                        notification.key,
                                        !preferences.notifications[notification.key as keyof typeof preferences.notifications],
                                    )
                                }
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    preferences.notifications[notification.key as keyof typeof preferences.notifications]
                                        ? "bg-primary"
                                        : "bg-surface"
                                }`}
                            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.notifications[notification.key as keyof typeof preferences.notifications]
                            ? "translate-x-6"
                            : "translate-x-1"
                    }`}
                />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>

            {/* General Settings */}
            <Card>
                <h2 className="text-xl font-semibold text-primary mb-4">Configurações Gerais</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                        <div>
                            <h4 className="font-medium text-primary">Iniciar pausas automaticamente</h4>
                            <p className="text-sm text-secondary">Iniciar pausas sem confirmação</p>
                        </div>
                        <button
                            onClick={() => updatePreference("general", "autoStartBreaks", !preferences.general.autoStartBreaks)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.general.autoStartBreaks ? "bg-primary" : "bg-surface"
                            }`}
                        >
              <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.general.autoStartBreaks ? "translate-x-6" : "translate-x-1"
                  }`}
              />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                        <div>
                            <h4 className="font-medium text-primary">Sons habilitados</h4>
                            <p className="text-sm text-secondary">Reproduzir sons de notificação</p>
                        </div>
                        <button
                            onClick={() => updatePreference("general", "soundEnabled", !preferences.general.soundEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                preferences.general.soundEnabled ? "bg-primary" : "bg-surface"
                            }`}
                        >
              <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.general.soundEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
              />
                        </button>
                    </div>
                </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button className="px-8">Salvar Preferências</Button>
            </div>
        </div>
    )
}
