import { prisma } from "../../prisma/client"
import {$Enums, Prisma} from "../generated/prisma"
import ActivityType = $Enums.ActivityType;


interface LogActivityParams {
    userId: string
    userName: string
    action: string
    type?: ActivityType
    details?: string
}

export const logActivity = async ({
                                      userId,
                                      userName,
                                      action,
                                      type = "system",
                                      details = "",
                                  }: LogActivityParams) => {
    try {
        await prisma.activityLog.create({
            data: {
                userId,
                userName,
                action,
                type,
                details,
            },
        })
    } catch (error) {
        console.error("Erro ao registrar log de atividade:", error)
    }
}
