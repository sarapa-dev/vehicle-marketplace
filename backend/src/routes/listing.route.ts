import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { createListing } from "../controllers/listing.controller";

const router = Router();

router.post("/", protectRoute, createListing);

export default router;
