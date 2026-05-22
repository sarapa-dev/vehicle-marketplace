import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import { getFavorites, addFavorite, removeFavorite } from "../controllers/favorite.controller";

const router = Router();

router.use(protectRoute);

router.get("/", getFavorites);
router.post("/", addFavorite);
router.delete("/:listing_id", removeFavorite);

export default router;
