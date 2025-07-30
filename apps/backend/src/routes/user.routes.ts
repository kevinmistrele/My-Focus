import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser, getMe, updateMe, deleteMe, changePassword, getUserStats,
} from "../controllers/user.controller";
import {requireAdmin} from "../middleware/requireAdmin";
import {verifyToken} from "../middleware/verifyToken";
import {requireUser} from "../middleware/requireUser";

const router = Router();

router.use(verifyToken);

router.get("/me", getMe)
router.put("/me", updateMe)
router.delete("/me", deleteMe)
router.put("/me/password", changePassword);
router.get("/me/stats", requireUser, getUserStats);


router.get("/", requireAdmin, getAllUsers)
router.get("/:id", requireAdmin, getUserById)
router.post("/", requireAdmin, createUser)
router.put("/:id", requireAdmin, updateUser)
router.delete("/:id", requireAdmin, deleteUser)


export default router;
