import {Request, Response} from "express";
import {logActivity} from "../services/logActivity";
import {$Enums} from "@prisma/client";
import * as bcrypt from "bcryptjs";
import {prisma} from "../prisma/client";
import {formatName, normalizeEmail} from "../utils/normalization";

// Função para mascarar email
const maskEmailForExport = (email: string): string => {
    const [local, domain] = email.split("@")
    if (!domain) return email

    if (local.length <= 2) {
        return `${local[0] ?? ""}***@${domain}`
    }

    const visible = local.slice(0, 2) // ex: "ke"
    const stars = "*".repeat(Math.max(local.length - 2, 3))

    return `${visible}${stars}@${domain}`
}
// Exporta todos os dados do usuário autenticado

// No topo do arquivo, junto com os outros exports
export const exportMyData = async (req: Request, res: Response) => {
    const userId = (req as any).userId

    if (!userId) {
        return res.status(401).json({error: "Não autenticado"})
    }

    const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            // Perfil básico
            id: true,
            name: true,
            email: true,
            avatar: true,
            type: true,
            createdAt: true,
            lastLogin: true,
            loginStreak: true,
            lastStreakDate: true,
            tasks: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    completed: true,
                    priority: true,
                    dueDate: true,
                    createdAt: true,
                    updatedAt: true,
                    tags: true,
                    pomodoros: true,
                },
            },
            sessions: {
                select: {
                    id: true,
                    duration: true,
                    type: true,
                    startTime: true,
                    endTime: true,
                    completed: true,
                },
            },
            goals: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    type: true,
                    category: true,
                    targetDate: true,
                    progress: true,
                    completed: true,
                    createdAt: true,
                },
            },
            habits: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    category: true,
                    streak: true,
                    bestStreak: true,
                    weeklyGoal: true,
                    weeklyProgress: true,
                    color: true,
                    createdAt: true,
                    checkins: {
                        select: {
                            id: true,
                            date: true,
                        },
                    },
                },
            },
            moods: {
                select: {
                    id: true,
                    mood: true,
                    note: true,
                    date: true,
                },
            },
            quotes: {
                select: {
                    id: true,
                    text: true,
                    author: true,
                    createdAt: true,
                },
            },
            notes: {
                select: {
                    id: true,
                    title: true,
                    content: true,
                    color: true,
                    pinned: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    })

    if (!user) {
        return res.status(404).json({error: "Usuário não encontrado"})
    }

    const payload = {
        metadata: {
            generatedAt: new Date().toISOString(),
            application: "MyFocus",
        },
        profile: {
            id: user.id,
            name: user.name,
            email: maskEmailForExport(user.email),
            avatar: user.avatar,
            type: user.type,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            loginStreak: user.loginStreak,
            lastStreakDate: user.lastStreakDate,
        },
        data: {
            tasks: user.tasks,
            pomodoroSessions: user.sessions,
            goals: user.goals,
            habits: user.habits,
            moods: user.moods,
            quotes: user.quotes,
            notes: user.notes,
        },
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8")
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="myfocus-dados-pessoais.json"',
    )

    return res.status(200).send(JSON.stringify(payload, null, 2))
}

// Pega Todos os usuários do sistema

export const getAllUsers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, name: true, email: true, avatar: true,
                type: true, createdAt: true, lastLogin: true, loginStreak: true
            },
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

// Pega um usuario especifico
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


//Pega um usuario pelo Id
export const getUserById = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: { tasks: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
    let {name, email, avatar, type, password} = req.body;

    if (!password) return res.status(400).json({error: "Senha é obrigatória."});

    name = formatName(String(name ?? ""));
    email = normalizeEmail(String(email ?? ""));

    // impede duplicidade por casing
    const exists = await prisma.user.findUnique({where: {email}});
    if (exists) return res.status(409).json({error: "Email already registered"});

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {name, email, avatar, type, password: hashedPassword},
        select: {id: true, name: true, email: true, avatar: true, type: true, createdAt: true},
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


// Pega as proprias informações
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


//Pega os status dos usuarios 
export const getUserStats = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    try {
        const [tasksCompleted, pomodoroSessions, totalFocusTimeRaw] = await Promise.all([
            prisma.task.count({ where: { userId, completed: true } }),

            prisma.pomodoroSession.count({ where: { userId } }),

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
        return res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
};

// Atualiza as proprias informações
export const updateMe = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const data: any = {};

    if (typeof req.body.name === "string") data.name = formatName(req.body.name);
    if (typeof req.body.email === "string") {
        const email = normalizeEmail(req.body.email);
        // checa duplicidade para outro usuário
        const conflict = await prisma.user.findUnique({where: {email}});
        if (conflict && conflict.id !== userId) {
            return res.status(409).json({error: "Email já em uso"});
        }
        data.email = email;
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data,
        select: {id: true, name: true, email: true, avatar: true, createdAt: true, type: true},
    });

    res.json(user);
};

// Atualiza um usuário existente
export const updateUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data: any = {};

    if (typeof req.body.name === "string") data.name = formatName(req.body.name);
    if (typeof req.body.email === "string") {
        const email = normalizeEmail(req.body.email);
        const conflict = await prisma.user.findUnique({where: {email}});
        if (conflict && conflict.id !== id) {
            return res.status(409).json({error: "Email já em uso"});
        }
        data.email = email;
    }
    if (typeof req.body.avatar !== "undefined") data.avatar = req.body.avatar;
    if (typeof req.body.type !== "undefined") data.type = req.body.type;

    const user = await prisma.user.update({
        where: {id},
        data,
        select: {id: true, name: true, email: true, avatar: true, type: true, createdAt: true},
    });

    await logActivity({
        userId: user.id,
        userName: user.name,
        action: "Atualização de usuário",
        type: $Enums.ActivityType.user,
        details: `Usuário "${user.name}" foi atualizado.`,
    });

    res.json(user);
};


// Deleta as proprias informações
export const deleteMe = async (req: Request, res: Response) => {
    const userId = (req as any).userId

    await prisma.activityLog.deleteMany({ where: { userId } })
    await prisma.user.delete({ where: { id: userId } })

    res.status(204).send()
}


// Atualiza a senha do usuário
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

// Deleta um usuário existente
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

