import {Request, Response} from "express";


// Middleware para lidar com rotas não encontradas
export const notFound = (_: Request, res: Response) =>
    res.status(404).json({ error: "Route not found" });
