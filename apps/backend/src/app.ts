import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import {notFound} from "./middleware/notFound";
import {errorHandler} from "./middleware/errorHandler";
import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/task.routes";
import pomodoroRoutes from "./routes/pomodoro.routes";
import goalRoutes from "./routes/goal.routes";
import habitRoutes from "./routes/habit.routes";
import activityRoutes from "./routes/activity.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import moodRoutes from "./routes/mood.routes";
import quoteRoutes from "./routes/quotes.routes";
import notesRoutes from "./routes/notes.routes";

dotenv.config();
// Inicializa o aplicativo Express e configura o middleware necessário e as rotas
const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/pomodoros", pomodoroRoutes);
app.use("/goals", goalRoutes);
app.use("/habits", habitRoutes);
app.use("/quotes", quoteRoutes);
app.use("/notes", notesRoutes)
app.use("/moods", moodRoutes);
app.use("/activities", activityRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes)

app.get("/healthz", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Middleware para tratamento de erros e rotas não encontradas
app.use(notFound);
// Error handling middleware
app.use(errorHandler);

export default app;
