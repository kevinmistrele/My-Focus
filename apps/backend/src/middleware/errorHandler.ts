import {NextFunction, Request, Response} from "express";


// Middleware global para tratamento de erros
export function errorHandler(
    err: any,
    _: Request,
    res: Response,
    __: NextFunction
) {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || "Internal server error" });
}
