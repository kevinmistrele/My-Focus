import * as dotenv from "dotenv";
import path from "path";
import {PrismaClient} from "@prisma/client";

// Carrega as variáveis de ambiente do arquivo .env.backend localizado dois níveis acima do diretório atual
dotenv.config({ path: path.resolve(__dirname, '../../../.env.backend') });

// Cria uma instância do Prisma Client para interagir com o banco de dados
export const prisma = new PrismaClient();

// Define o tipo MoodLog como o resultado não nulo da função findFirst do modelo moodLog
export type MoodLog = NonNullable<Awaited<ReturnType<typeof prisma.moodLog.findFirst>>>;