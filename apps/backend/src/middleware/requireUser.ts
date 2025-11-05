import {NextFunction, Request, Response} from "express";
import {prisma} from "../prisma/client";
import * as jwt from "jsonwebtoken";

import {JWT_SECRET} from "../config";


//Middleware para garantir que o usuário autenticado é do tipo "user" ou "admin"
export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user || (user.type !== "user" && user.type !== "admin")) {
            return res.status(403).json({ error: "User access required" });
        }

        (req as any).user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};
