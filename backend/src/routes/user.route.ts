import { Router } from "express";
import { getUserProfile, updateUserProfile, getUserListings } from "../controllers/user.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

router.get("/profile/:user_id", getUserProfile);
router.put("/profile/:user_id", protectRoute, updateUserProfile);
router.get("/:user_id/listings", getUserListings);

export default router;
