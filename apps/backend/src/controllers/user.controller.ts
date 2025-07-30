import { Request, Response } from "express";
import { logActivity } from "../services/logActivity";
import { $Enums } from "../generated/prisma";
import * as bcrypt from "bcryptjs";
import {prisma} from "../../prisma/client";

export const getAllUsers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count()
    ])

    res.json({
        data: users,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    })
}


export const getCurrentUser = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    if (!userId) return res.status(401).json({ error: "Não autenticado" });

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            createdAt: true,
            type: true,
            loginStreak: true,
        },
    });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const [totalSessions, totalDuration] = await Promise.all([
        prisma.pomodoroSession.count({
            where: { userId }
        }),
        prisma.pomodoroSession.aggregate({
            where: { userId },
            _sum: { duration: true },
        }),
    ]);

    const durationSum = totalDuration._sum.duration || 0;

    return res.json({
        ...user,
        pomodoroStats: {
            totalSessions,
            totalDuration: durationSum,
        },
    });
};






export const getUserById = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: { tasks: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email, avatar, type, password } = req.body;

    if (!password) {
        return res.status(400).json({ error: "Senha é obrigatória." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            avatar,
            type,
            password: hashedPassword,
        },
    });
    await logActivity({
        userId: user.id,
        userName: user.name,
        action: "Criação de usuário",
        type: $Enums.ActivityType.user,
        details: `Usuário "${user.name}" criado com email ${user.email}.`,
    });

    res.status(201).json(user);
};


export const getMe = async (req: Request, res: Response) => {
    const userId = (req as any).userId

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            createdAt: true,
            type: true,
        },
    })

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" })
    return res.json(user)
}

export const getUserStats = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    try {
        const [tasksCompleted, pomodoroSessions, totalFocusTimeRaw] = await Promise.all([
            prisma.task.count({ where: { userId, completed: true } }),

            // Agora conta TODAS as sessões (sem filtro de tipo ou completed)
            prisma.pomodoroSession.count({ where: { userId } }),

            // Soma a duração de TODAS as sessões
            prisma.pomodoroSession.aggregate({
                _sum: { duration: true },
                where: { userId },
            }),
        ]);

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { loginStreak: true },
        });

        const totalFocusTime = totalFocusTimeRaw._sum.duration || 0;

        return res.json({
            tasksCompleted,
            pomodoroSessions,        // totalSessions
            totalFocusTime,          // totalDuration
            streak: user?.loginStreak ?? 0,
        });
    } catch (err) {
        console.error("Erro ao buscar estatísticas do usuário:", err);
        return res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
};


export const updateMe = async (req: Request, res: Response) => {
    const userId = (req as any).userId

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            name: req.body.name,
            email: req.body.email,
        },
    })

    res.json(user)
}

export const deleteMe = async (req: Request, res: Response) => {
    const userId = (req as any).userId

    await prisma.activityLog.deleteMany({ where: { userId } })
    await prisma.user.delete({ where: { id: userId } })

    res.status(204).send()
}


export const updateUser = async (req: Request, res: Response) => {
    const { name, email, avatar, type } = req.body

    const user = await prisma.user.update({
        where: { id: req.params.id },
        data: {
            name,
            email,
            avatar,
            type,
        },
    })

    await logActivity({
        userId: user.id,
        userName: user.name,
        action: "Atualização de usuário",
        type: $Enums.ActivityType.user,
        details: `Usuário "${user.name}" foi atualizado.`,
    })

    res.json(user)
}



export const changePassword = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Preencha todos os campos." });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ error: "Senha atual incorreta" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
    });

    return res.json({ success: true });
};


export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });


    await logActivity({
        userId: user.id,
        userName: user.name,
        action: "Exclusão de usuário",
        type: $Enums.ActivityType.user,
        details: `Usuário "${user.name}" foi excluído.`,
    });


    await prisma.activityLog.deleteMany({ where: { userId } });

    await prisma.user.delete({ where: { id: userId } });

    res.status(204).send();
};

