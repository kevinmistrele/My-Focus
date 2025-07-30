import { Request, Response } from "express";
import { prisma } from "../../prisma/client";

export const getQuotes = async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    const [systemQuotes, userQuotes] = await Promise.all([
        prisma.quote.findMany({ where: { userId: null } }),
        prisma.quote.findMany({ where: { userId } }),
    ]);

    res.json([...systemQuotes, ...userQuotes]);
};

export const createQuote = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { text, author } = req.body;

    const existingCount = await prisma.quote.count({ where: { userId } });
    if (existingCount >= 5) {
        return res.status(400).json({ error: "Você só pode ter no máximo 5 frases." });
    }

    const newQuote = await prisma.quote.create({
        data: {
            text,
            author,
            userId,
        },
    });

    res.status(201).json(newQuote);
};

export const updateQuote = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { text, author } = req.body;

    const quote = await prisma.quote.findUnique({ where: { id } });
    if (!quote || quote.userId !== userId) {
        return res.status(403).json({ error: "Acesso negado" });
    }

    const updated = await prisma.quote.update({
        where: { id },
        data: { text, author },
    });

    res.json(updated);
};

export const deleteQuote = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;

    const quote = await prisma.quote.findUnique({ where: { id } });
    if (!quote || quote.userId !== userId) {
        return res.status(403).json({ error: "Acesso negado" });
    }

    await prisma.quote.delete({ where: { id } });
    res.status(204).send();
};
