"use client"

import { useState, useEffect } from "react"
import { taskService } from "../services/task.service"
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilters } from "../types/task"

export function useTasks(filters?: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTasks()
  }, [filters])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await taskService.getTasks(filters)
      setTasks(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData: CreateTaskRequest) => {
    try {
      const newTask = await taskService.createTask(taskData)
      setTasks((prev) => [newTask, ...prev])
      return newTask
    } catch (err) {
      throw err
    }
  }

  const updateTask = async (id: string, updates: UpdateTaskRequest) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates)
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)))
      return updatedTask
    } catch (err) {
      throw err
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (err) {
      throw err
    }
  }

  const completeTask = async (id: string) => {
    try {
      const completedTask = await taskService.completeTask(id)
      setTasks((prev) => prev.map((task) => (task.id === id ? completedTask : task)))
      return completedTask
    } catch (err) {
      throw err
    }
  }

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
  }
}
