import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import {
  getFeaturedListings,
  getDiscountedListings,
  getRecentlySoldListings,
  createListing,
} from "../controllers/listing.controller";

const router = Router();

router.get("/featured", getFeaturedListings);
router.get("/discounted", getDiscountedListings);
router.get("/recently-sold", getRecentlySoldListings);

router.post("/", protectRoute, createListing);

export default router;
