import {useEffect, useRef} from "react"
import {PomodoroService} from "../services"

const STORAGE_KEY = "myfocus:pomodoro"

// Componente que monitora o estado do temporizador Pomodoro e registra sessões concluídas
export function PomodoroWatcher() {
    const handledRef = useRef<string | null>(null)
    useEffect(() => {
        const check = async () => {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) return

            let saved: any
            try { saved = JSON.parse(raw) } catch { return }

            const { startTime, isActive, customMinutes, lastCompletedAt } = saved || {}
            if (!isActive || !startTime || !customMinutes) return

            const endAt = startTime + customMinutes * 60 * 1000
            const now = Date.now()
            const alreadyHandledForThisStart =
                handledRef.current === String(startTime) || lastCompletedAt === startTime

            if (now >= endAt && !alreadyHandledForThisStart) {
                handledRef.current = String(startTime)

                try {
                    const startDate = new Date(startTime)
                    await PomodoroService.create({
                        duration: customMinutes,
                        type: "work" as const,
                        startTime: startDate,
                    })
                } catch {
                    // silencioso — você pode logar se quiser
                }

                if (typeof Notification !== "undefined" && Notification.permission === "granted") {
                    new Notification("MyFocus", {
                        body: "Sessão de foco concluída! 🎉",
                        icon: "/favicon.ico",
                    })
                }

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({
                        ...saved,
                        isActive: false,
                        startTime: null,
                        lastCompletedAt: startTime,
                    }),
                )

                window.dispatchEvent(new CustomEvent("pomodoro:completed", { detail: { startTime } }))
            }
        }

        check()
        const id = setInterval(check, 1000)
        return () => clearInterval(id)
    }, [])

    return null
}
