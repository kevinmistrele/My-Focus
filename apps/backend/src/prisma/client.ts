import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '../../../.env.backend') });
import {Prisma, PrismaClient } from "@prisma/client";


export const prisma = new PrismaClient();

export type MoodLog = NonNullable<Awaited<ReturnType<typeof prisma.moodLog.findFirst>>>;