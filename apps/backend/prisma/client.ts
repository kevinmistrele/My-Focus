import * as dotenv from "dotenv";
import path from "path";

// Resolve corretamente baseado em onde você roda o projeto
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
import { PrismaClient } from "../src/generated/prisma";

console.log("✅ DATABASE_URL:", process.env.DATABASE_URL);

export const prisma = new PrismaClient();