// src/middleware/requireAdmin.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma/client";

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId;


    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.type !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
    }

    next();
};
