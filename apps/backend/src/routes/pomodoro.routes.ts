import {Router} from "express";
import {
    createPomodoroSession,
    deletePomodoroSession,
    getPomodorosByUser,
    getPomodoroSummary,
    updatePomodoroSession,
} from "../controllers/pomodoro.controller";
import {requireUser} from "../middleware/requireUser";
import {verifyToken} from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);
// Rotas para gerenciamento de sessões Pomodoro do usuário
router.get("/", requireUser, getPomodorosByUser);
router.get("/pomodoro-sumary", requireUser, getPomodoroSummary);
router.post("/", requireUser, createPomodoroSession);
router.put("/:id", requireUser, updatePomodoroSession);
router.delete("/:id", requireUser, deletePomodoroSession);

export default router;
