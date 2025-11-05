import {Router} from "express";
import {forgotPassword, login, register, resetPassword,} from "../controllers/auth.controller";
import {authenticate} from "../middleware/authenticate";
import {getCurrentUser} from "../controllers/user.controller";

const router = Router();

// Rotas de autenticação, login e gerenciamento de senha
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authenticate, getCurrentUser);

export default router;
