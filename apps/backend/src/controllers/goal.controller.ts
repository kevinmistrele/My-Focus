import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { logActivity } from "../services/logActivity";
import { $Enums } from "@prisma/client";

export const getGoalsByUser = async (req: Request, res: Response) => {
    const user = (req as any).user;

    if (!user || !user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const goals = await prisma.goal.findMany({ where: { userId: user.id } });
    res.json(goals);
};

export const createGoal = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const {
        title,
        description,
        type,
        category,
        targetDate,
        progress = 0,
        completed = false,
    } = req.body;

    const existingGoalsCount = await prisma.goal.count({
        where: { userId: user.id },
    });

    if (existingGoalsCount >= 8) {
        return res.status(400).json({ error: "Limite de 8 metas atingido." });
    }

    const goal = await prisma.goal.create({
        data: {
            title,
            description,
            type,
            category,
            targetDate: new Date(targetDate),
            progress,
            completed,
            user: {
                connect: { id: user.id },
            },
        },
    });

    await logActivity({
        userId: user.id,
        userName: goal.title,
        action: "Criação de meta",
        type: $Enums.ActivityType.goal,
        details: `Meta "${goal.title}" criada.`,
    });

    res.status(201).json(goal);
};


export const updateGoal = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { id } = req.params;

    const goal = await prisma.goal.findUnique({ where: { id } });

    if (!goal || goal.userId !== user.id) {
        return res.status(403).json({ error: "Acesso negado ou meta não encontrada" });
    }

    const {
        title,
        description,
        type,
        category,
        targetDate,
        progress,
        completed
    } = req.body;

    const data: any = {
        ...(title && { title }),
        ...(description && { description }),
        ...(type && { type }),
        ...(category && { category }),
        ...(typeof progress !== "undefined" && { progress }),
        ...(typeof completed !== "undefined" && { completed }),
        ...(targetDate && { targetDate: new Date(targetDate) }),
    };

    const updated = await prisma.goal.update({ where: { id }, data });

    await logActivity({
        userId: user.id,
        userName: updated.title,
        action: "Atualização de meta",
        type: $Enums.ActivityType.goal,
        details: `Meta "${updated.title}" atualizada.`,
    });

    res.json(updated);
};

export const deleteGoal = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const goal = await prisma.goal.findUnique({ where: { id: req.params.id } });

    if (!goal || goal.userId !== user.id) {
        return res.status(403).json({ error: "Acesso negado ou meta não encontrada" });
    }

    await prisma.goal.delete({ where: { id: goal.id } });

    await logActivity({
        userId: user.id,
        userName: goal.title,
        action: "Exclusão de meta",
        type: $Enums.ActivityType.goal,
        details: `Meta "${goal.title}" excluída.`,
    });

    res.status(204).send();
};