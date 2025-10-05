import { Router } from "express";
import { register, login, logout, getCurrentUser } from "../controllers/auth.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, getCurrentUser);

export default router;
