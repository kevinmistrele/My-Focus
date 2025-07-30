"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import {type MoodEntry, type MoodPayload, MoodService, type MoodStats} from "../services/mood.service.ts";
import {toast} from "sonner";

const moodEmojis = {
    happy: "😊",
    neutral: "😐",
    sad: "😢",
}

const moodLabels = {
    happy: "Feliz",
    neutral: "Neutro",
    sad: "Triste",
}

const moodColors = {
    happy: "text-green-500",
    neutral: "text-yellow-500",
    sad: "text-red-500",
}

export const MoodPage: React.FC = () => {
    const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
    const [todayMood, setTodayMood] = useState<MoodEntry | null>(null)
    const [showMoodModal, setShowMoodModal] = useState(false)
    const [selectedMood, setSelectedMood] = useState<"happy" | "neutral" | "sad">("neutral")
    const [note, setNote] = useState("")
    const [stats, setStats] = useState<MoodStats>({
        happy: 0,
        neutral: 0,
        sad: 0,
        total: 0,
    })

    useEffect(() => {
        loadMoodEntries()
    }, [])

    const loadMoodEntries = async () => {
        try {
            const res = await MoodService.getAll()
            if (!res) return
            setMoodEntries(res.moods)
            setStats(res.stats)

            const today = new Date().toDateString()
            const todayEntry = res.moods.find((entry) => new Date(entry.date).toDateString() === today)
            setTodayMood(todayEntry || null)
        } catch (err) {
            toast.error("Erro ao carregar registros de humor.")
        }
    }

    const saveMoodEntry = async () => {
        try {
            const payload: MoodPayload = {
                mood: selectedMood,
                note: note.trim() || undefined,
            }

            if (todayMood) {
                await MoodService.update(todayMood.id, payload)
                toast.success("Registro de humor atualizado.")
            } else {
                await MoodService.create(payload)
                toast.success("Humor registrado com sucesso.")
            }

            setShowMoodModal(false)
            setNote("")
            await loadMoodEntries()
        } catch (err) {
            toast.error("Erro ao salvar humor.")
        }
    }


    const deleteMood = async (id: string) => {
        try {
            await MoodService.delete(id)
            await loadMoodEntries()
            toast.success("Registro removido com sucesso.")
        } catch (err) {
            toast.error("Erro ao remover humor.")
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Registro de Humor</h1>
                    <p className="text-secondary mt-1">Como você está se sentindo hoje?</p>
                </div>
            </div>

            {/* Humor de Hoje */}
            <Card>
                <div className="text-center py-8">
                    <h2 className="text-xl font-semibold text-primary mb-6">😊 Como está seu dia?</h2>

                    {todayMood ? (
                        <div className="space-y-4">
                            <div className="text-6xl">{moodEmojis[todayMood.mood]}</div>
                            <p className="text-lg text-primary">
                                Você está se sentindo{" "}
                                <span className={moodColors[todayMood.mood]}>{moodLabels[todayMood.mood]}</span>
                            </p>
                            {todayMood.note && <p className="text-secondary italic">"{todayMood.note}"</p>}
                            <Button variant="outline" onClick={() => setShowMoodModal(true)}>
                                Atualizar Humor
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-muted">Você ainda não registrou seu humor hoje.</p>
                            <Button onClick={() => setShowMoodModal(true)}>Registrar Humor</Button>
                        </div>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Estatísticas */}
                <Card>
                    <h3 className="text-lg font-semibold text-primary mb-4">📊 Últimos 7 dias</h3>

                    {stats.total === 0 ? (
                        <p className="text-muted text-center py-8">Nenhum registro na última semana.</p>
                    ) : (
                        <div className="space-y-4">
                            {(["happy", "neutral", "sad"] as const).map((mood) => (
                                <div key={mood} className={`flex items-center justify-between p-3 bg-${mood}-500/10 rounded-lg`}>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{moodEmojis[mood]}</span>
                                        <span className="text-primary">{moodLabels[mood]}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-lg font-bold ${moodColors[mood]}`}>
                                            {stats[mood as keyof typeof stats]}
                                        </div>
                                        <div className="text-sm text-muted">
                                            {stats.total > 0
                                                ? Math.round((stats[mood as keyof typeof stats] / stats.total) * 100)
                                                : 0}
                                            %
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Histórico */}
                <Card>
                    <h3 className="text-lg font-semibold text-primary mb-4">📅 Histórico</h3>

                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {moodEntries.length === 0 ? (
                            <p className="text-muted text-center py-8">
                                Nenhum registro ainda.
                                <br />
                                Comece registrando seu humor hoje!
                            </p>
                        ) : (
                            moodEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-start space-x-3 p-3 bg-surface-light rounded-lg"
                                >
                                    <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                      <span className={`font-medium ${moodColors[entry.mood]}`}>
                        {moodLabels[entry.mood]}
                      </span>
                                            <span className="text-sm text-muted">
                        {new Date(entry.date).toLocaleDateString("pt-BR")}
                      </span>
                                        </div>
                                        {entry.note && (
                                            <p className="text-sm text-secondary mt-1">"{entry.note}"</p>
                                        )}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-500"
                                        onClick={() => deleteMood(entry.id)}
                                    >
                                        Remover
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Modal Registrar Humor */}
            <Modal isOpen={showMoodModal} onClose={() => setShowMoodModal(false)} title="Registrar Humor">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-primary mb-3">
                            Como você está se sentindo?
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {(["happy", "neutral", "sad"] as const).map((mood) => (
                                <button
                                    key={mood}
                                    onClick={() => setSelectedMood(mood)}
                                    className={`p-4 rounded-lg border-2 transition-all ${
                                        selectedMood === mood
                                            ? "border-primary bg-primary/10"
                                            : "border-custom hover:border-primary/50"
                                    }`}
                                >
                                    <div className="text-4xl mb-2">{moodEmojis[mood]}</div>
                                    <div className={`text-sm font-medium ${moodColors[mood]}`}>
                                        {moodLabels[mood]}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">Nota (opcional)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Como foi seu dia? O que aconteceu?"
                            className="w-full p-3 bg-surface border border-custom rounded-lg text-primary placeholder-muted resize-none"
                            rows={3}
                            maxLength={200}
                        />
                        <div className="text-right text-sm text-muted mt-1">{note.length}/200</div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button variant="ghost" onClick={() => setShowMoodModal(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={saveMoodEntry}>Salvar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
