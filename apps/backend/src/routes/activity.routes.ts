import { Router } from "express";
import { getActivitiesByUser, getAllActivities } from "../controllers/activity.controller";
import {requireAdmin} from "../middleware/requireAdmin";
import {verifyToken} from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);

router.get("/", requireAdmin, getAllActivities);
router.get("/:userId", requireAdmin, getActivitiesByUser);

export default router;
