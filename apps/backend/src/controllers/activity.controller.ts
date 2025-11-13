import {Request, Response} from "express";
import {prisma} from "../prisma/client";

const maskEmailInText = (text: string): string => {
    if (!text) return text

    const emailRegex =
        /([a-zA-Z0-9._%+-]{1,64})@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g

    return text.replace(emailRegex, (match, local, domain) => {
        if (!local) return match

        if (local.length <= 2) {
            return `${local[0] ?? ""}***@${domain}`
        }

        const visible = local.slice(0, 2)
        const stars = "*".repeat(Math.max(local.length - 2, 3))

        return `${visible}${stars}@${domain}`
    })
}

// Pega os logs de atividade de um usuário específico
export const getActivitiesByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const logs = await prisma.activityLog.findMany({
            where: { userId },
            orderBy: { timestamp: "desc" },
        });

        const sanitized = logs.map(log => ({
            ...log,
            details: maskEmailInText(log.details),
            userName: maskEmailInText(log.userName), // se algum dia tiver e-mail aqui
        }))

        res.json(sanitized);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar logs de atividade" });
    }
};

// Pega todos os logs de atividade com paginação e contagem por tipo
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
                by: ["type"],
                _count: { type: true },
            }),
        ])

        const sanitized = logs.map(log => ({
            ...log,
            details: maskEmailInText(log.details),
            userName: maskEmailInText(log.userName),
        }))


        const typeCounts = {
            user: 0,
            task: 0,
            pomodoro: 0,
            system: 0,
            goal: 0
        }

        totalByType.forEach((item: { type: keyof typeof typeCounts, _count: { type: number } }) => {
            typeCounts[item.type] = item._count.type;
        });


        res.json({
            data: sanitized,
            total,
            totalByType: typeCounts,
        })
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar logs de atividade" })
    }
}
