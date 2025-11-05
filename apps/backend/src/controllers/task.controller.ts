import {Request, Response} from "express";
import {prisma} from "../prisma/client";
import {logActivity} from "../services/logActivity";
import {$Enums, Task} from "@prisma/client";

// Pega as tarefas do usuário com paginação
export const getAllTasks = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { page = 1, limit = 10 } = req.query;

    if (!user || !user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [tasks, total] = await Promise.all([
        prisma.task.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            skip,
            take,
        }),
        prisma.task.count({
            where: { userId: user.id },
        }),
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
        data: tasks,
        total,
        page: Number(page),
        totalPages,
    });
};


// Pega o resumo das tarefas do dia do usuário
export const getTodayTaskSummary = async (req: Request, res: Response) => {
    const user = (req as any).user
    const start = new Date()
    start.setUTCHours(0, 0, 0, 0)

    const end = new Date()
    end.setUTCHours(23, 59, 59, 999)

    const tasks = await prisma.task.findMany({
        where: {
            userId: user.id,
            createdAt: {
                gte: start,
                lte: end,
            },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
    })

    const completed = tasks.filter((t: Task) => t.completed).length;
    const total = tasks.length
    const pomodoros = tasks.reduce(
        (sum: number, t: Task) => sum + (t.pomodoros || 0),
        0
    );
    const focusedMinutes = pomodoros * 25

    res.json({
        completed,
        total,
        pomodoros,
        focusedMinutes,
        recentTasks: tasks,
    })
}


// Pega uma tarefa específica do usuário
export const getTaskById = async (req: Request, res: Response) => {
    const user = (req as any).user;

    const task = await prisma.task.findFirst({
        where: {
            id: req.params.id,
            userId: user.id,
        },
    });

    if (!task) return res.status(404).json({ error: "Task não encontrada" });

    res.json(task);
};

//Cria uma nova tarefa para o usuário
export const createTask = async (req: Request, res: Response) => {
    const { title, description, dueDate, priority, tags } = req.body;
    const user = (req as any).user;

    if (!user || !user.id) {
        return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const task = await prisma.task.create({
        data: {
            title,
            description,
            dueDate,
            priority,
            tags: tags ?? [],
            createdAt: new Date(),
            user: {
                connect: { id: user.id },
            },
        },
    });

    await logActivity({
        userId: user.id,
        userName: task.title,
        action: "Criação de tarefa",
        type: $Enums.ActivityType.task,
        details: `Tarefa "${task.title}" criada com prioridade "${task.priority ?? 'normal'}".`,
    });

    res.status(201).json(task);
};

// Atualiza uma tarefa existente do usuário
export const updateTask = async (req: Request, res: Response) => {
    const task = await prisma.task.update({
        where: { id: req.params.id },
        data: req.body,
    });

    await logActivity({
        userId: task.userId,
        userName: task.title,
        action: "Atualização de tarefa",
        type: $Enums.ActivityType.task,
        details: `Tarefa "${task.title}" foi atualizada.`,
    });

    res.json(task);
};


// Deleta uma tarefa do usuário
export const deleteTask = async (req: Request, res: Response) => {
    const task = await prisma.task.delete({ where: { id: req.params.id } });

    await logActivity({
        userId: task.userId,
        userName: task.title,
        action: "Exclusão de tarefa",
        type: $Enums.ActivityType.task,
        details: `Tarefa "${task.title}" foi excluída.`,
    });

    res.status(204).send();
};


