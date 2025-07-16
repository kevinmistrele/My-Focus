import { Request, Response } from "express";
import {prisma} from "../../prisma/client";

export const getAllUsers = async (_: Request, res: Response) => {
    const users = await prisma.user.findMany({
        include: { preferences: true, tasks: true },
    });
    res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
        where: { id },
        include: { preferences: true, tasks: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email, avatar, type } = req.body;
    const newUser = await prisma.user.create({
        data: { name, email, avatar, type },
    });
    res.status(201).json(newUser);
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const updated = await prisma.user.update({
        where: { id },
        data,
    });
    res.json(updated);
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
};
