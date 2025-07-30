// src/middleware/authenticate.ts

import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        (req as any).userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido" });
    }
};
