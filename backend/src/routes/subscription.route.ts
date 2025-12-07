import express, { Router } from "express";
import {
  getSubscriptionPlans,
  getSubscriptionPlan,
  createCheckoutSession,
  subscriptionWebhook,
} from "../controllers/subscription.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getSubscriptionPlans);
router.get("/current", protectRoute, getSubscriptionPlan);
router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/webhook", express.raw({ type: "application/json" }), subscriptionWebhook);

export default router;
