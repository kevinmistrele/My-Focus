import { Router } from "express";
import {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask, getTodayTaskSummary,
} from "../controllers/task.controller";
import {requireUser} from "../middleware/requireUser";
import {verifyToken} from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);

router.get("/", requireUser, getAllTasks);
router.get("/today-summary", requireUser, getTodayTaskSummary)
router.get("/:id", requireUser,  getTaskById);
router.post("/", requireUser, createTask);
router.put("/:id",requireUser,  updateTask);
router.delete("/:id",requireUser,  deleteTask);

export default router;
