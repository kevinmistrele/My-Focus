// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export function errorHandler(
    err: any,
    _: Request,
    res: Response,
    __: NextFunction
) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || "Internal server error" });
}
