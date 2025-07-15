"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"

interface Note {
    id: string
    title: string
    content: string
    color: string
    pinned: boolean
    createdAt: Date
    updatedAt: Date
}

export const NotesPage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([
        {
            id: "1",
            title: "Ideias para o projeto",
            content: "- Implementar dark mode\n- Adicionar notificações push\n- Melhorar UX do dashboard",
            color: "bg-yellow-200",
            pinned: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "2",
            title: "Lista de compras",
            content: "Leite, Pão, Ovos, Frutas, Café",
            color: "bg-green-200",
            pinned: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: "3",
            title: "Reunião de equipe",
            content: "Discutir roadmap do Q1\nRevisar métricas\nPlanejar sprint",
            color: "bg-blue-200",
            pinned: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ])

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedColor, setSelectedColor] = useState("bg-yellow-200")

    const colors = ["bg-yellow-200", "bg-green-200", "bg-blue-200", "bg-pink-200", "bg-purple-200", "bg-orange-200"]

    const addNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: "Nova anotação",
            content: "",
            color: selectedColor,
            pinned: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        setNotes([newNote, ...notes])
    }

    const updateNote = (id: string, updates: Partial<Note>) => {
        setNotes(notes.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note)))
    }

    const deleteNote = (id: string) => {
        setNotes(notes.filter((note) => note.id !== id))
    }

    const togglePin = (id: string) => {
        updateNote(id, { pinned: !notes.find((n) => n.id === id)?.pinned })
    }

    const filteredNotes = notes.filter(
        (note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const pinnedNotes = filteredNotes.filter((note) => note.pinned)
    const unpinnedNotes = filteredNotes.filter((note) => !note.pinned)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Anotações</h1>
                    <p className="text-secondary mt-1">Capture suas ideias rapidamente</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`w-6 h-6 rounded-full ${color} border-2 ${
                                    selectedColor === color ? "border-primary" : "border-transparent"
                                } hover:scale-110 transition-transform`}
                            />
                        ))}
                    </div>
                    <Button onClick={addNote} className="shadow-purple">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nova Nota
                    </Button>
                </div>
            </div>

            {/* Search */}
            <Card>
                <Input
                    placeholder="Buscar anotações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
            </Card>

            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                            <path
                                fillRule="evenodd"
                                d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Fixadas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                        {pinnedNotes.map((note) => (
                            <NoteCard key={note.id} note={note} onUpdate={updateNote} onDelete={deleteNote} onTogglePin={togglePin} />
                        ))}
                    </div>
                </div>
            )}

            {/* Other Notes */}
            {unpinnedNotes.length > 0 && (
                <div>
                    {pinnedNotes.length > 0 && <h2 className="text-lg font-semibold text-primary mb-4">Outras</h2>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {unpinnedNotes.map((note) => (
                            <NoteCard key={note.id} note={note} onUpdate={updateNote} onDelete={deleteNote} onTogglePin={togglePin} />
                        ))}
                    </div>
                </div>
            )}

            {filteredNotes.length === 0 && (
                <Card>
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-lg font-medium text-secondary mb-2">
                            {searchTerm ? "Nenhuma anotação encontrada" : "Nenhuma anotação criada"}
                        </h3>
                        <p className="text-muted mb-4">
                            {searchTerm ? "Tente buscar por outros termos" : "Comece criando sua primeira anotação"}
                        </p>
                        {!searchTerm && <Button onClick={addNote}>Criar primeira anotação</Button>}
                    </div>
                </Card>
            )}
        </div>
    )
}

// Note Card Component
interface NoteCardProps {
    note: Note
    onUpdate: (id: string, updates: Partial<Note>) => void
    onDelete: (id: string) => void
    onTogglePin: (id: string) => void
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onUpdate, onDelete, onTogglePin }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(note.title)
    const [content, setContent] = useState(note.content)

    const handleSave = () => {
        onUpdate(note.id, { title, content })
        setIsEditing(false)
    }

    const handleCancel = () => {
        setTitle(note.title)
        setContent(note.content)
        setIsEditing(false)
    }

    return (
        <div className={`${note.color} rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow relative group`}>
            {/* Pin Button */}
            <button
                onClick={() => onTogglePin(note.id)}
                className={`absolute top-2 right-2 p-1 rounded ${
                    note.pinned ? "text-gray-700" : "text-gray-400 opacity-0 group-hover:opacity-100"
                } hover:bg-black/10 transition-all`}
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path
                        fillRule="evenodd"
                        d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isEditing ? (
                <div className="space-y-3">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent border-none outline-none font-semibold text-gray-800 placeholder-gray-600"
                        placeholder="Título da nota..."
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-600 resize-none"
                        placeholder="Escreva sua anotação..."
                        rows={4}
                    />
                    <div className="flex space-x-2">
                        <Button size="sm" onClick={handleSave}>
                            Salvar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            ) : (
                <div onClick={() => setIsEditing(true)} className="cursor-pointer">
                    <h3 className="font-semibold text-gray-800 mb-2 pr-6">{note.title}</h3>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{note.content}</p>
                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-black/10">
                        <span className="text-xs text-gray-600">{note.updatedAt.toLocaleDateString("pt-BR")}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(note.id)
                            }}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
