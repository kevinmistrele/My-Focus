import { Request, Response } from "express"
import { prisma } from "../../prisma/client"
import { startOfDay, endOfDay, startOfMonth } from "date-fns"

export const getAdminStats = async (_req: Request, res: Response) => {
    const now = new Date()

    const [
        totalUsers,
        totalTasks,
        totalPomodoroSessions,
        newUsersThisMonth,
        tasksCompletedToday,
        activeUsersRaw,
        averageFocusTimeRaw,
        recentActivity, // <- adicionado
    ] = await Promise.all([
        prisma.user.count(),
        prisma.task.count(),
        prisma.pomodoroSession.count(),
        prisma.user.count({ where: { createdAt: { gte: startOfMonth(now) } } }),
        prisma.task.count({
            where: {
                completed: true,
                updatedAt: {
                    gte: startOfDay(now),
                    lte: endOfDay(now),
                },
            },
        }),
        prisma.user.count({
            where: {
                lastLogin: {
                    gte: new Date(Date.now() - 1000 * 60 * 60 * 24), // últimas 24h
                },
            },
        }),
        prisma.pomodoroSession.aggregate({
            _avg: {
                duration: true,
            },
            where: {
                type: "work",
            },
        }),
        prisma.activityLog.findMany({
            take: 5,
            orderBy: { timestamp: "desc" },
            select: {
                id: true,
                userName: true,
                action: true,
                timestamp: true,
                type: true,
            },
        }),
    ])

    const averageFocusTime = Math.round(averageFocusTimeRaw._avg.duration || 0)
    const engagementRate = totalUsers > 0 ? Math.round((activeUsersRaw / totalUsers) * 100) : 0

    res.json({
        totalUsers,
        totalTasks,
        totalPomodoroSessions,
        newUsersThisMonth,
        tasksCompletedToday,
        activeUsers: activeUsersRaw,
        averageFocusTime,
        engagementRate,
        recentActivity, // <- incluído na resposta
    })
}
