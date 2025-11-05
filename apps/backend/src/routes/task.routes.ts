import {Router} from "express";
import {
    createTask,
    deleteTask,
    getAllTasks,
    getTaskById,
    getTodayTaskSummary,
    updateTask,
} from "../controllers/task.controller";
import {requireUser} from "../middleware/requireUser";
import {verifyToken} from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);
// Rotas para gerenciamento de tarefas do usuário
router.get("/", requireUser, getAllTasks);
router.get("/today-summary", requireUser, getTodayTaskSummary)
router.get("/:id", requireUser,  getTaskById);
router.post("/", requireUser, createTask);
router.put("/:id",requireUser,  updateTask);
router.delete("/:id",requireUser,  deleteTask);

export default router;
