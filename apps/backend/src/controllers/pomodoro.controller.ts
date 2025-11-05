import {Request, Response} from "express";
import {prisma} from "../prisma/client";
import {logActivity} from "../services/logActivity";
import {$Enums} from "@prisma/client";


// Pega as sessões Pomodoro do usuário
export const getPomodorosByUser = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { page = 1, limit = 10 } = req.query;

    if (!user || !user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [sessions, total, totalDuration] = await Promise.all([
        prisma.pomodoroSession.findMany({
            where: { userId: user.id },
            orderBy: { startTime: "desc" },
            skip,
            take,
        }),
        prisma.pomodoroSession.count({
            where: { userId: user.id },
        }),
        prisma.pomodoroSession.aggregate({
            where: { userId: user.id },
            _sum: { duration: true },
        }),
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
        data: sessions,
        total,
        totalDuration: totalDuration._sum.duration || 0,
        page: Number(page),
        totalPages,
    });
};

// Pega o resumo das sessões Pomodoro do usuário
export const getPomodoroSummary = async (req: Request, res: Response) => {
    const user = (req as any).user

    if (!user || !user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" })
    }

    const [total, totalDuration] = await Promise.all([
        prisma.pomodoroSession.count({ where: { userId: user.id } }),
        prisma.pomodoroSession.aggregate({
            where: { userId: user.id },
            _sum: { duration: true },
        }),
    ])

    return res.json({
        totalSessions: total,
        totalDuration: totalDuration._sum.duration || 0,
    })
}

// Cria uma nova sessão Pomodoro para o usuário
export const createPomodoroSession = async (req: Request, res: Response) => {
    const { duration, type } = req.body;
    const user = (req as any).user;

    if (!user || !user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const session = await prisma.pomodoroSession.create({
        data: {
            duration,
            type: $Enums.SessionType.work,
            startTime: new Date(),
            user: {
                connect: { id: user.id },
            },
        },
    });

    await logActivity({
        userId: user.id,
        userName: session.id,
        action: "Criação de sessão Pomodoro",
        type: $Enums.ActivityType.pomodoro,
        details: `Sessão do tipo "${session.type}" criada com duração de ${session.duration} minutos.`,
    });

    res.status(201).json(session);
};

// Atualiza uma sessão Pomodoro existente

export const updatePomodoroSession = async (req: Request, res: Response) => {
    const session = await prisma.pomodoroSession.update({
        where: { id: req.params.id },
        data: req.body,
    });

    await logActivity({
        userId: session.userId,
        userName: session.id,
        action: "Atualização de sessão Pomodoro",
        type: $Enums.ActivityType.pomodoro,
        details: `Sessão "${session.id}" atualizada.`,
    });

    res.json(session);
};


// Deleta uma sessão Pomodoro do usuário
export const deletePomodoroSession = async (req: Request, res: Response) => {
    const session = await prisma.pomodoroSession.delete({ where: { id: req.params.id } });

    await logActivity({
        userId: session.userId,
        userName: session.id,
        action: "Exclusão de sessão Pomodoro",
        type: $Enums.ActivityType.pomodoro,
        details: `Sessão "${session.id}" excluída.`,
    });

    res.status(204).send();
};
