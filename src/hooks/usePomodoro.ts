"use client"

import { useState, useEffect, useRef } from "react"
import { pomodoroService } from "../services/pomodoro.service"
import type { PomodoroSession, PomodoroSettings } from "../types/pomodoro"

export function usePomodoro() {
  const [currentSession, setCurrentSession] = useState<PomodoroSession | null>(null)
  const [settings, setSettings] = useState<PomodoroSettings | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const loadSettings = async () => {
    try {
      const pomodoroSettings = await pomodoroService.getSettings()
      setSettings(pomodoroSettings)
    } catch (error) {
      console.error("Failed to load pomodoro settings:", error)
    }
  }

  const startSession = async (taskId?: string) => {
    if (!settings) return

    try {
      const duration = isBreak ? settings.shortBreakDuration * 60 : settings.workDuration * 60
      const type = isBreak ? "short-break" : "work"

      const session = await pomodoroService.createSession({
        taskId,
        duration,
        type,
      })

      setCurrentSession(session)
      setTimeLeft(duration)
      setIsRunning(true)
    } catch (error) {
      console.error("Failed to start session:", error)
    }
  }

  const pauseSession = () => {
    setIsRunning(false)
  }

  const resumeSession = () => {
    setIsRunning(true)
  }

  const stopSession = async () => {
    if (currentSession) {
      try {
        await pomodoroService.completeSession(currentSession.id)
      } catch (error) {
        console.error("Failed to complete session:", error)
      }
    }

    resetSession()
  }

  const resetSession = () => {
    setCurrentSession(null)
    setTimeLeft(0)
    setIsRunning(false)
  }

  const handleSessionComplete = async () => {
    if (currentSession) {
      try {
        await pomodoroService.completeSession(currentSession.id)
        setIsBreak(!isBreak)
      } catch (error) {
        console.error("Failed to complete session:", error)
      }
    }

    setIsRunning(false)
  }

  const updateSettings = async (newSettings: Partial<PomodoroSettings>) => {
    try {
      const updatedSettings = await pomodoroService.updateSettings(newSettings)
      setSettings(updatedSettings)
    } catch (error) {
      console.error("Failed to update settings:", error)
    }
  }

  return {
    currentSession,
    settings,
    timeLeft,
    isRunning,
    isBreak,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    resetSession,
    updateSettings,
  }
}
