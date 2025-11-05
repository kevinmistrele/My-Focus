import {Router} from "express";
import {createGoal, deleteGoal, getGoalsByUser, updateGoal,} from "../controllers/goal.controller";
import {requireUser} from "../middleware/requireUser";
import {verifyToken} from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);
// Rotas para gerenciamento de metas do usuário
router.get("/", requireUser, getGoalsByUser);
router.post("/", requireUser, createGoal);
router.put("/:id", requireUser, updateGoal);
router.delete("/:id", requireUser, deleteGoal);

export default router;
