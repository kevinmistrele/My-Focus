import {Router} from "express";
import {verifyToken} from "../middleware/verifyToken";
import {createQuote, deleteQuote, getQuotes, updateQuote} from "../controllers/quotes.controller";

const router = Router();

router.use(verifyToken);
// Rotas para gerenciamento de citações do usuário
router.get("/", getQuotes);
router.post("/", createQuote);
router.put("/:id", updateQuote);
router.delete("/:id", deleteQuote);

export default router;
