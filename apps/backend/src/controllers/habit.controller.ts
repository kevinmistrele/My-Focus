import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { logActivity } from "../services/logActivity";
import { $Enums } from "../generated/prisma";
import { startOfDay, endOfDay } from 'date-fns'


export const getHabitsByUser = async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (!user || !user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const habits = await prisma.habit.findMany({
        where: { userId: user.id },
        include: {
            checkins: {
                where: {
                    date: {
                        gte: startOfDay(new Date()),
                        lte: endOfDay(new Date()),
                    },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    const transformed = habits.map(habit => ({
        ...habit,
        completedToday: habit.checkins.length > 0,
    }));

    res.json(transformed);
};

export const getTodayHabitSummary = async (req: Request, res: Response) => {
    const user = (req as any).user

    const habits = await prisma.habit.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
            checkins: {
                where: {
                    date: {
                        gte: startOfDay(new Date()),
                        lte: endOfDay(new Date()),
                    },
                },
            },
        },
    })

    const todayHabits = habits.map((habit) => ({
        ...habit,
        completedToday: habit.checkins.length > 0,
    }))

    const completed = todayHabits.filter((h) => h.completedToday).length
    const total = todayHabits.length
    const weeklyGoal = total > 0 ? Math.floor((completed / total) * 100) : 0
    const streak = 0 // Aqui futuramente você pode calcular baseado em check-ins sequenciais

    res.json({
        streak,
        weeklyGoal,
        todayHabits,
    })
}

export const createHabit = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const habitCount = await prisma.habit.count({
        where: { userId: user.id },
    });

    if (habitCount >= 10) {
        return res.status(400).json({ error: "Limite de 10 hábitos atingido." });
    }

    const {
        name,
        description,
        color,
        category = "Geral",
        streak = 0,
        bestStreak = 0,
        weeklyGoal = 7,
    } = req.body;

    const habit = await prisma.habit.create({
        data: {
            name,
            description,
            color,
            category,
            streak,
            bestStreak,
            weeklyGoal,
            user: {
                connect: { id: user.id },
            },
        },
    });

    res.status(201).json(habit);
};


export const updateHabit = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const habit = await prisma.habit.findUnique({ where: { id: req.params.id } });
    if (!habit || habit.userId !== user.id) {
        return res.status(404).json({ error: "Hábito não encontrado ou acesso negado" });
    }

    const updated = await prisma.habit.update({
        where: { id: req.params.id },
        data: req.body,
    });

    res.json(updated);
};

export const checkinHabit = async (req: Request, res: Response) => {
    const user = (req as any).user
    const habitId = req.params.id
    const today = new Date()

    // Verifica se já tem check-in hoje
    const existingCheckin = await prisma.habitCheckin.findFirst({
        where: {
            habitId,
            userId: user.id,
            date: {
                gte: startOfDay(today),
                lte: endOfDay(today),
            },
        },
    })

    if (existingCheckin) {
        // Uncheck: remove o checkin de hoje
        await prisma.habitCheckin.delete({
            where: {
                habitId_date: {
                    habitId,
                    date: existingCheckin.date,
                },
            },
        })
    } else {
        // Check: cria checkin
        await prisma.habitCheckin.create({
            data: {
                habitId,
                userId: user.id,
                date: today,
            },
        })
    }

    // 🔄 Atualiza streaks e progresso após alteração
    const allCheckins = await prisma.habitCheckin.findMany({
        where: { habitId },
        orderBy: { date: "desc" },
    })

    const dates = allCheckins.map(c => startOfDay(new Date(c.date)).getTime())

    // Calcula streak
    let streak = 0
    let bestStreak = 0
    let currentDate = startOfDay(new Date()).getTime()

    for (let i = 0; i < dates.length; i++) {
        if (dates.includes(currentDate)) {
            streak++
            bestStreak = Math.max(bestStreak, streak)
            currentDate -= 86400000 // volta 1 dia
        } else {
            break
        }
    }

    // Calcula progresso semanal
    const startOfWeek = startOfDay(new Date())
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()) // domingo

    const weeklyProgress = allCheckins.filter(c =>
        new Date(c.date) >= startOfWeek
    ).length

    // 🔁 Atualiza o hábito no banco
    await prisma.habit.update({
        where: { id: habitId },
        data: {
            streak,
            bestStreak,
            weeklyProgress,
        },
    })

    return res.json({ status: existingCheckin ? "unchecked" : "checked" })
}


export const deleteHabit = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const habit = await prisma.habit.findUnique({ where: { id: req.params.id } });
    if (!habit || habit.userId !== user.id) {
        return res.status(404).json({ error: "Hábito não encontrado ou acesso negado" });
    }

    await prisma.habit.delete({ where: { id: req.params.id } });

    res.status(204).send();
};
