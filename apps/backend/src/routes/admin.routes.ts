import {Router} from "express"
import {getAdminStats} from "../controllers/admin.controller"
import {requireAdmin} from "../middleware/requireAdmin";
import {verifyToken} from "../middleware/verifyToken";

const router = Router()
// Rota para obter estatísticas administrativas
router.get("/stats",verifyToken, requireAdmin ,getAdminStats)

export default router
