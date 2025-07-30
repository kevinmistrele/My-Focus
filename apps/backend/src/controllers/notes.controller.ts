import { Request, Response } from "express"
import { prisma } from "../../prisma/client"

export const getNotes = async (req: Request, res: Response) => {
    const userId = (req as any).userId

    const notes = await prisma.note.findMany({
        where: { userId },
        orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    })

    res.json(notes)
}

export const createNote = async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const { title, content, color, pinned } = req.body

    const total = await prisma.note.count({ where: { userId } })
    if (total >= 10) {
        return res.status(400).json({ error: "Limite de 10 anotações atingido." })
    }

    const note = await prisma.note.create({
        data: {
            userId,
            title,
            content,
            color: color || "bg-yellow-200",
            pinned: !!pinned,
        },
    })

    res.status(201).json(note)
}
export const updateNote = async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const { id } = req.params
    const { title, content, color, pinned } = req.body

    const existing = await prisma.note.findUnique({ where: { id } })

    if (!existing || existing.userId !== userId) {
        return res.status(403).json({ error: "Acesso negado" })
    }

    const updated = await prisma.note.update({
        where: { id },
        data: {
            title,
            content,
            color,
            pinned,
        },
    })

    res.json(updated)
}

export const deleteNote = async (req: Request, res: Response) => {
    const userId = (req as any).userId
    const { id } = req.params

    const note = await prisma.note.findUnique({ where: { id } })

    if (!note || note.userId !== userId) {
        return res.status(403).json({ error: "Acesso negado" })
    }

    await prisma.note.delete({ where: { id } })
    res.status(204).send()
}
