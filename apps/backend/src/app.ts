// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./src/routes/user.routes";
import taskRoutes from "./src/routes/task.routes";
import preferencesRoutes from "./src/routes/preferences.routes";
import pomodoroRoutes from "./src/routes/pomodoro.routes";
import goalRoutes from "./src/routes/goal.routes";
import habitRoutes from "./src/routes/habit.routes";
import activityRoutes from "./src/routes/activity.routes";

import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// monta as rotas
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/preferences", preferencesRoutes);
app.use("/pomodoros", pomodoroRoutes);
app.use("/goals", goalRoutes);
app.use("/habits", habitRoutes);
app.use("/activities", activityRoutes);

// 404 + handler
app.use(notFound);
app.use(errorHandler);

export default app;
