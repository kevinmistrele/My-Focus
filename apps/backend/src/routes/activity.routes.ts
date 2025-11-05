import {Router} from "express";
import {getActivitiesByUser, getAllActivities} from "../controllers/activity.controller";
import {requireAdmin} from "../middleware/requireAdmin";
import {verifyToken} from "../middleware/verifyToken";
// Rotas para atividades
const router = Router();
// Aplica o middleware de verificação de token a todas as rotas deste roteador
router.use(verifyToken);
// Rota para obter todas as atividades (admin apenas)
router.get("/", requireAdmin, getAllActivities);
router.get("/:userId", requireAdmin, getActivitiesByUser);

export default router;
