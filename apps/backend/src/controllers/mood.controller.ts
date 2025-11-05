import {Request, Response} from "express";
import {MoodLog} from "@prisma/client";
import {prisma} from "../prisma/client";

// Pega os registros de humor do usuário
export const getMoods = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    const moods = await prisma.moodLog.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 7,
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const lastWeekEntries = await prisma.moodLog.findMany({
        where: {
            userId,
            date: {
                gte: new Date(sevenDaysAgo.setHours(0, 0, 0, 0)),
                lte: new Date(),
            },
        },
    });

    const stats = {
        happy: lastWeekEntries.filter((m: MoodLog) => m.mood === "happy").length,
        neutral: lastWeekEntries.filter((m: MoodLog) => m.mood === "neutral").length,
        sad: lastWeekEntries.filter((m: MoodLog) => m.mood === "sad").length,
        total: lastWeekEntries.length,
    };


    res.json({ moods, stats });
};


// Cria ou atualiza o registro de humor do dia
export const createMood = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { mood, note } = req.body;

    const count = await prisma.moodLog.count({ where: { userId } });
    if (count >= 7) {
        return res.status(400).json({ error: "Limite de 7 registros atingido." });
    }

    const today = new Date();
    const existingToday = await prisma.moodLog.findFirst({
        where: {
            userId,
            date: {
                gte: new Date(today.setHours(0, 0, 0, 0)),
                lte: new Date(today.setHours(23, 59, 59, 999)),
            },
        },
    });

    if (existingToday) {
        const updatedMood = await prisma.moodLog.update({
            where: { id: existingToday.id },
            data: { mood, note },
        })
        return res.json(updatedMood)
    }

    const newMood = await prisma.moodLog.create({
        data: {
            mood,
            note,
            userId,
        },
    });

    res.status(201).json(newMood);
};

// Atualiza um registro de humor existente
export const updateMood = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { mood, note } = req.body;

    const existing = await prisma.moodLog.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
        return res.status(403).json({ error: "Acesso negado" });
    }

    const updated = await prisma.moodLog.update({
        where: { id },
        data: { mood, note },
    });

    res.json(updated);
};

// Deleta um registro de humor
export const deleteMood = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    const mood = await prisma.moodLog.findUnique({ where: { id } });
    if (!mood || mood.userId !== userId) {
        return res.status(403).json({ error: "Acesso negado" });
    }

    await prisma.moodLog.delete({ where: { id } });
    res.status(204).send();
};
