import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        (req as any).user = jwt.verify(token, JWT_SECRET) as { userId: string };
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};