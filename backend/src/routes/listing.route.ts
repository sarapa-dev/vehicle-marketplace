import { Router } from "express";
import { protectRoute, optionalAuth } from "../middlewares/auth.middleware";
import {
  getFeaturedListings,
  getDiscountedListings,
  getRecentlySoldListings,
  createListing,
  deleteListing,
  searchListings,
  getListingById,
} from "../controllers/listing.controller";

const router = Router();

router.get("/search", optionalAuth, searchListings);
router.get("/featured", optionalAuth, getFeaturedListings);
router.get("/discounted", optionalAuth, getDiscountedListings);
router.get("/recently-sold", getRecentlySoldListings);

router.get("/:id", getListingById);
router.post("/", protectRoute, createListing);
router.delete("/:id", protectRoute, deleteListing);

export default router;
