import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import {
  getFeaturedListings,
  getDiscountedListings,
  getRecentlySoldListings,
  createListing,
  searchListings,
  getListingById,
} from "../controllers/listing.controller";

const router = Router();

router.get("/search", searchListings);
router.get("/featured", getFeaturedListings);
router.get("/discounted", getDiscountedListings);
router.get("/recently-sold", getRecentlySoldListings);
router.get("/:id", getListingById);

router.post("/", protectRoute, createListing);

export default router;
