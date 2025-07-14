"use client"

import type React from "react"
import { Card } from "../ui/Card"
import { Button } from "../ui/Button"
import type { Task } from "../../lib/types"
import { formatDate } from "../../lib/utils"

interface TaskCardProps {
    task: Task
    onToggle: (id: string) => void
    onEdit: (task: Task) => void
    onDelete: (id: string) => void
}

const priorityColors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
    return (
        <Card className="hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                    <button
                        onClick={() => onToggle(task.id)}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            task.completed ? "bg-primary border-primary" : "border-custom-light hover:border-primary"
                        }`}
                    >
                        {task.completed && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </button>

                    <div className="flex-1">
                        <h3 className={`font-medium ${task.completed ? "line-through text-muted" : "text-primary"}`}>
                            {task.title}
                        </h3>
                        {task.description && <p className="text-secondary text-sm mt-1">{task.description}</p>}

                        <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
                                <span className="text-xs text-muted capitalize">{task.priority}</span>
                            </div>

                            {task.dueDate && <span className="text-xs text-muted">{formatDate(task.dueDate)}</span>}

                            {task.tags.length > 0 && (
                                <div className="flex space-x-1">
                                    {task.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-1 bg-surface-light text-xs rounded-full text-secondary">
                      {tag}
                    </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex space-x-1 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </Button>
                </div>
            </div>
        </Card>
    )
}
