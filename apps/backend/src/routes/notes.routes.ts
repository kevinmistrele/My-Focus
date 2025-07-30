import { Router } from "express"
import { verifyToken } from "../middleware/verifyToken"
import { requireUser } from "../middleware/requireUser"
import {createNote, deleteNote, getNotes, updateNote} from "../controllers/notes.controller";


const router = Router()

router.use(verifyToken)

router.get("/", requireUser, getNotes)
router.post("/", requireUser, createNote)
router.put("/:id", requireUser, updateNote)
router.delete("/:id", requireUser, deleteNote)

export default router
