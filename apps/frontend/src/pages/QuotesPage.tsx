"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Modal } from "../components/ui/Modal"
import {QuotesService} from "../services/quotes.service.ts";
import { toast } from "sonner"

interface Quote {
    id: string
    text: string
    author?: string | null
    userId?: string | null
}

export const QuotesPage: React.FC = () => {
    const [quotes, setQuotes] = useState<Quote[]>([])
    const [dailyQuote, setDailyQuote] = useState<Quote | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newQuote, setNewQuote] = useState({ text: "", author: "" })
    const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
    const [editForm, setEditForm] = useState({ text: "", author: "" })
    const [isAdding, setIsAdding] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null)


    const systemQuotes: Quote[] = [
        {
            id: "sys1",
            text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
            author: "Robert Collier",
            userId: null,
        },
        { id: "sys2", text: "Você é mais forte do que imagina.", author: null, userId: null },
        { id: "sys3", text: "A persistência é o caminho do êxito.", author: "Charles Chaplin", userId: null },
        { id: "sys4", text: "Grandes conquistas requerem grandes ambições.", author: "Heráclito", userId: null },
        {
            id: "sys5",
            text: "O futuro pertence àqueles que acreditam na beleza de seus sonhos.",
            author: "Eleanor Roosevelt",
            userId: null,
        },
    ]

    useEffect(() => {
        loadQuotes()
    }, [])

    const loadQuotes = async () => {
        setIsEditing(true)
        try {
            const res = await QuotesService.getAll()
            if (!res) return
            setQuotes(res)

            const today = new Date().toDateString()
            const savedDailyQuote = localStorage.getItem("dailyQuote")
            const savedDate = localStorage.getItem("dailyQuoteDate")

            if (savedDailyQuote && savedDate === today) {
                setDailyQuote(JSON.parse(savedDailyQuote))
            } else {
                const allQuotes = [...systemQuotes, ...res]
                const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)]
                setDailyQuote(randomQuote)
                localStorage.setItem("dailyQuote", JSON.stringify(randomQuote))
                localStorage.setItem("dailyQuoteDate", today)
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            toast.error("Erro ao carregar frases.")
        } finally {
            setIsEditing(false)
        }
    }


    const addQuote = async () => {
        if (!newQuote.text.trim()) return
        if (quotes.length >= 5) {
            toast.error("Você pode ter no máximo 5 frases pessoais.")
            return
        }

        try {
            setIsAdding(true)
            await QuotesService.create({
                text: newQuote.text.trim(),
                author: newQuote.author.trim() || undefined,
            })
            setNewQuote({ text: "", author: "" })
            setShowAddModal(false)
            await loadQuotes()
        } catch {
            toast.error("Erro ao adicionar frase.")
        } finally {
            setIsAdding(false)
        }
    }



    const removeQuote = async (id: string) => {
        setLoadingDeleteId(id)
        try {
            await QuotesService.delete(id)
            await loadQuotes()
            toast.success("Frase removida com sucesso.")
        } catch {
            toast.error("Erro ao remover frase.")
        } finally {
            setLoadingDeleteId(null)
        }
    }



    const getNewRandomQuote = () => {
        const allQuotes = [...systemQuotes, ...quotes]
        if (allQuotes.length > 0) {
            const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)]
            setDailyQuote(randomQuote)
            localStorage.setItem("dailyQuote", JSON.stringify(randomQuote))
            localStorage.setItem("dailyQuoteDate", new Date().toDateString())
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Frases Motivacionais</h1>
                    <p className="text-secondary mt-1">Inspire-se todos os dias</p>
                </div>
            </div>

            {/* Frase do Dia */}
            <Card>
                <div className="text-center py-8">
                    <h2 className="text-xl font-semibold text-primary mb-6">💭 Frase do Dia</h2>
                    {dailyQuote ? (
                        <div className="space-y-4">
                            <blockquote className="text-2xl font-medium text-primary italic">"{dailyQuote.text}"</blockquote>
                            {dailyQuote.author && <p className="text-secondary">— {dailyQuote.author}</p>}
                            <Button variant="outline" onClick={getNewRandomQuote} className="mt-4 bg-transparent">
                                Nova Frase
                            </Button>
                        </div>
                    ) : (
                        <p className="text-muted">Carregando frase do dia...</p>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Suas Frases */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-primary">Suas Frases ({quotes.length}/5)</h3>
                        <Button onClick={() => setShowAddModal(true)} disabled={quotes.length >= 5} size="sm">
                            Adicionar
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {quotes.length === 0 ? (
                            <p className="text-muted text-center py-8">
                                Você ainda não criou nenhuma frase.
                                <br />
                                Adicione frases que te inspiram!
                            </p>
                        ) : (
                            quotes.map((quote) => (
                                <div key={quote.id} className="p-4 bg-surface-light rounded-lg">
                                    <p className="text-primary font-medium">"{quote.text}"</p>
                                    {quote.author && <p className="text-secondary text-sm mt-1">— {quote.author}</p>}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setEditingQuote(quote)
                                            setEditForm({ text: quote.text, author: quote.author || "" })
                                            setShowAddModal(false)
                                        }}
                                        className="mt-2 text-blue-500 hover:text-blue-400"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeQuote(quote.id)}
                                        className="mt-2 text-red-400 hover:text-red-300"
                                        disabled={loadingDeleteId === quote.id}
                                        loading={loadingDeleteId === quote.id}
                                    >
                                        Remover
                                    </Button>

                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Frases do Sistema */}
                <Card>
                    <h3 className="text-lg font-semibold text-primary mb-4">Frases Inspiradoras</h3>
                    <div className="space-y-3">
                        {systemQuotes.map((quote) => (
                            <div key={quote.id} className="p-4 bg-surface-light rounded-lg">
                                <p className="text-primary font-medium">"{quote.text}"</p>
                                {quote.author && <p className="text-secondary text-sm mt-1">— {quote.author}</p>}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Modal Adicionar Frase */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Adicionar Frase">
                <div className="space-y-4">
                    <Input
                        label="Frase"
                        value={newQuote.text}
                        onChange={(e) => setNewQuote((prev) => ({ ...prev, text: e.target.value }))}
                        placeholder="Digite sua frase motivacional..."
                        maxLength={200}
                    />
                    <Input
                        label="Autor (opcional)"
                        value={newQuote.author}
                        onChange={(e) => setNewQuote((prev) => ({ ...prev, author: e.target.value }))}
                        placeholder="Nome do autor..."
                    />
                    <div className="flex justify-end space-x-2">
                        <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={addQuote} disabled={!newQuote.text.trim() || isAdding} loading={isAdding}>
                            Adicionar
                        </Button>

                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={!!editingQuote}
                onClose={() => setEditingQuote(null)}
                title="Editar Frase"
            >
                <div className="space-y-4">
                    <Input
                        label="Frase"
                        value={editForm.text}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, text: e.target.value }))}
                        placeholder="Digite sua frase motivacional..."
                        maxLength={200}
                    />
                    <Input
                        label="Autor (opcional)"
                        value={editForm.author}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, author: e.target.value }))}
                        placeholder="Nome do autor..."
                    />
                    <div className="flex justify-end space-x-2">
                        <Button variant="ghost" onClick={() => setEditingQuote(null)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={async () => {
                                if (!editingQuote) return
                                try {
                                    await QuotesService.update(editingQuote.id, {
                                        text: editForm.text.trim(),
                                        author: editForm.author.trim() || undefined,
                                    })
                                    setEditingQuote(null)
                                    await loadQuotes()
                                    toast.success("Frase editada com sucesso!")
                                } catch (err) {
                                    toast.error("Erro ao salvar edição da frase.")
                                }
                            }}
                            disabled={!editForm.text.trim()}
                            loading={isEditing}
                        >
                            Salvar
                        </Button>
                    </div>
                </div>
            </Modal>

        </div>
    )
}
