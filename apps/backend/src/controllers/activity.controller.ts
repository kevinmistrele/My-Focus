import {Request, Response} from "express";
import {prisma} from "../prisma/client";
import {$Enums} from "prisma-client-1d6036527485651c028a613ad88151fe800296b65b0bd90fe86800d2da228bc8";
import ActivityType = $Enums.ActivityType;

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
    const typeParam = req.query.type as string | undefined

    const skip = (page - 1) * limit

    // Filtro por tipo (usado só na listagem/paginação)
    const where: { type?: ActivityType } = {}

    if (
        typeParam &&
        ["user", "task", "pomodoro", "system", "goal"].includes(typeParam)
    ) {
        where.type = typeParam as ActivityType
    }

    try {
        const [logs, totalGlobal, totalFiltered, totalByTypeGlobal] =
            await Promise.all([
                prisma.activityLog.findMany({
                    where,
                    orderBy: {timestamp: "desc"},
                    skip,
                    take: limit,
                }),
                prisma.activityLog.count(), // total geral (sem filtro)
                prisma.activityLog.count({where}), // total filtrado
                prisma.activityLog.groupBy({
                    by: ["type"],
                    _count: {type: true},
                }),
            ])

        const sanitized = logs.map((log) => ({
            ...log,
            details: maskEmailInText(log.details),
            userName: maskEmailInText(log.userName),
        }))

        const typeCounts = {
            user: 0,
            task: 0,
            pomodoro: 0,
            system: 0,
            goal: 0,
        }

        totalByTypeGlobal.forEach((item) => {
            typeCounts[item.type] = item._count.type
        })

        res.json({
            data: sanitized,
            total: totalGlobal, // usado nos cards (Total de Logs)
            page,
            limit,
            totalPages: Math.ceil(totalFiltered / limit), // paginação baseada no filtro
            totalByType: typeCounts, // usado nos cards por tipo (geral)
        })
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar logs de atividade" })
    }
}