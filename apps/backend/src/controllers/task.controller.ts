import { Request, Response } from "express";
import {prisma} from "../../prisma/client";

export const getAllTasks = async (_: Request, res: Response) => {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
};

export const getTaskById = async (req: Request, res: Response) => {
    const task = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
};

export const createTask = async (req: Request, res: Response) => {
    const data = req.body; // { title, description, dueDate, priority, userId, tags }
    const task = await prisma.task.create({ data });
    res.status(201).json(task);
};

export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const task = await prisma.task.update({ where: { id }, data });
    res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.status(204).send();
};
