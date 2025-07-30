import { Request, Response } from "express";
import { prisma } from "../../prisma/client";

// GET /activities/:userId → logs de um usuário
export const getActivitiesByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const logs = await prisma.activityLog.findMany({
            where: { userId },
            orderBy: { timestamp: "desc" },
        });

        res.json(logs);
    } catch (error) {
        console.error("Erro ao buscar logs:", error);
        res.status(500).json({ error: "Erro ao buscar logs de atividade" });
    }
};

// GET /activities → logs do sistema inteiro (opcional)
export const getAllActivities = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    try {
        const [logs, total, totalByType] = await Promise.all([
            prisma.activityLog.findMany({
                orderBy: { timestamp: "desc" },
                skip,
                take: limit,
            }),
            prisma.activityLog.count(),
            prisma.activityLog.groupBy({
                by: ['type'],
                _count: { type: true },
            })
        ])

        const typeCounts = {
            user: 0,
            task: 0,
            pomodoro: 0,
            system: 0,
        }

        totalByType.forEach((item) => {
            typeCounts[item.type] = item._count.type
        })

        res.json({
            data: logs,
            total,
            totalByType: typeCounts,
        })
    } catch (error) {
        console.error("Erro ao buscar logs:", error)
        res.status(500).json({ error: "Erro ao buscar logs de atividade" })
    }
}
