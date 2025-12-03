import { Request, Response } from "express";
import Stripe from "stripe";
import prisma from "../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const getSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.subscription_plan.findMany({
      omit: {
        stripe_price_id: true,
        created_at: true,
      },
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const userId = req.user.user_id;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: req.user.email,
      line_items: [
        {
          price: process.env.STRIPE_PREMIUM_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/subscription/success`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        userId: String(userId),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

const PREMIUM_PLAN_ID = 2;

export const subscriptionWebhook = async (req: Request, res: Response) => {
  let event: Stripe.Event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return res.status(400).send("Invalid signature");
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const userId = Number(session.metadata?.userId);
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        // fetch full subscription object to get start and end date
        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        // get just part for date
        const dateData = sub.items.data[0]!;

        // date from Stripe is in Unix format, need to convert to ISO Standard
        const periodStart = new Date(dateData.current_period_start! * 1000).toISOString();
        const periodEnd = new Date(dateData.current_period_end! * 1000).toISOString();

        const existing = await prisma.user_subscription.findFirst({
          where: { user_id: userId },
        });

        await prisma.user_subscription.update({
          where: { user_subscription_id: existing!.user_subscription_id },
          data: {
            subscription_plan_id: PREMIUM_PLAN_ID,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: "active",
            start_date: periodStart,
            end_date: periodEnd,
          },
        });

        break;
      }

      // case "customer.subscription.deleted": {
      //   const subscription = event.data.object as Stripe.Subscription;

      //   await prisma.user_subscription.updateMany({
      //     where: { stripe_subscription_id: subscription.id },
      //     data: { status: "canceled" },
      //   });

      //   break;
      // }
    }

    return res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
