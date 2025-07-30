import { Router } from "express";
import {createMood, deleteMood, getMoods, updateMood} from "../controllers/mood.controller";
import {verifyToken} from "../middleware/verifyToken";
import {requireUser} from "../middleware/requireUser";

const router = Router();

router.use(verifyToken);

router.get("/", requireUser, getMoods);
router.post("/",requireUser, createMood);
router.put("/:id", requireUser, updateMood);
router.delete("/:id", requireUser, deleteMood);

export default router;
