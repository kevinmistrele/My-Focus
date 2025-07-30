import { Router } from "express";
import {
    getHabitsByUser,
    createHabit,
    updateHabit,
    deleteHabit, getTodayHabitSummary, checkinHabit,
} from "../controllers/habit.controller";
import {requireUser} from "../middleware/requireUser";
import {verifyToken} from "../middleware/verifyToken";

const router = Router();

router.use(verifyToken);

router.get("/", requireUser, getHabitsByUser);
router.post("/:id/checkin",requireUser, checkinHabit)
router.get("/today-summary", requireUser, getTodayHabitSummary)
router.post("/", requireUser, createHabit);
router.put("/:id", requireUser, updateHabit);
router.delete("/:id", requireUser, deleteHabit);

export default router;
