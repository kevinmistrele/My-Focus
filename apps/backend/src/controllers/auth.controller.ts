import {Request, Response} from "express";
import {prisma} from "../prisma/client";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {logActivity} from "../services/logActivity";
import {$Enums} from "@prisma/client";
import {isSameDay, startOfDay, subDays} from "date-fns";
import {sendResetPasswordEmail} from "../services/emailService";


import {JWT_SECRET} from "../config";

// registra um novo usuário no sistema e cria um log de atividade para o registro do usuário
export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
    });

    await logActivity({
        userId: user.id,
        userName: user.name,
        action: "Registro de novo usuário",
        type: $Enums.ActivityType.user,
        details: `Usuário ${user.email} foi registrado.`,
    });

    res.status(201).json({ message: "User registered", user: { id: user.id, email: user.email } });
};


// login de usuário, atualização de streak de login, geração de token JWT e criação de log de atividade para o login do usuário
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) return res.status(401).json({ error: "Invalid credentials" })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: "Invalid credentials" })

    const today = startOfDay(new Date())
    const yesterday = subDays(today, 1)
    const lastStreakDate = user.lastStreakDate ? startOfDay(user.lastStreakDate) : null

    let newStreak = 1
    if (lastStreakDate) {
        if (isSameDay(lastStreakDate, today)) {
            newStreak = user.loginStreak
        } else if (isSameDay(lastStreakDate, yesterday)) {
            newStreak = user.loginStreak + 1
        }
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            lastLogin: new Date(),
            loginStreak: newStreak,
            lastStreakDate: today,
        },
    })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" })

    await logActivity({
        userId: user.id,
        userName: user.name,
        action: "Login",
        type: $Enums.ActivityType.user,
        details: `Usuário ${user.email} fez login.`,
    })

    const completeUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            createdAt: true,
            type: true,
            loginStreak: true,
        },
    });

    res.json({
        token,
        user: completeUser,
    });
}

// solicita redefinição de senha, gera token JWT, envia email de redefinição e cria log de atividade para a solicitação de redefinição de senha
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "15m" });

    await sendResetPasswordEmail(email, resetToken);

    await logActivity({
        userId: user.id,
        userName: user.name,
        action: "Solicitação de redefinição de senha",
        type: $Enums.ActivityType.user,
        details: `Usuário ${user.email} solicitou redefinição de senha.`,
    });

    res.json({ message: "Password reset link sent" });
};

// redefine a senha do usuário, atualiza a senha no banco de dados e cria log de atividade para a redefinição de senha
export const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: decoded.userId },
            data: { password: hashedPassword },
        });

        await logActivity({
            userId: decoded.userId,
            userName: user.name,
            action: "Redefinição de senha",
            type: $Enums.ActivityType.user,
            details: `Usuário ${user.email} redefiniu a senha.`,
        });

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(400).json({ error: "Invalid or expired token" });
    }
};
