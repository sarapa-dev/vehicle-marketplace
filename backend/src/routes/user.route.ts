import { Router } from "express";
import { getUserProfile, getUserListings } from "../controllers/user.controller";

const router = Router();

router.get("/profile/:user_id", getUserProfile);
router.get("/:user_id/listings", getUserListings);

export default router;
