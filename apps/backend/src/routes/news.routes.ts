import {Router} from "express";
import {verifyToken} from "../middleware/verifyToken";
import {requireUser} from "../middleware/requireUser";
import {getProductivityNews} from "../controllers/news.controller";

const router = Router();

router.use(verifyToken);
router.get("/productivity", requireUser, getProductivityNews);

export default router;
