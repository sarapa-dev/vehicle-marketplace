import { Request, Response } from "express";
import Stripe from "stripe";
import prisma from "../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const getSubscriptionPlans = async (_req: Request, res: Response) => {
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

export const getSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const userId = req.user.user_id;

    const plan = await prisma.user_subscription.findFirst({
      where: { user_id: userId },
      omit: {
        user_id: true,
        subscription_plan_id: true,
        stripe_customer_id: true,
        stripe_subscription_id: true,
      },
      include: {
        subscription_plan: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createCheckoutSession = async (
  req: Request<{}, {}, { subscription_plan_id: number }>,
  res: Response
) => {
  try {
    const userId = req.user.user_id;
    const { subscription_plan_id } = req.body;

    const plan = await prisma.subscription_plan.findUnique({
      where: { subscription_plan_id },
    });

    if (!plan) {
      return res.status(400).json({ message: "Plan not found" });
    }

    if (!plan.stripe_price_id) {
      return res.status(500).json({ message: "Plan missing Stripe price ID" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: req.user.email,
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/subscription/success`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        userId: String(userId),
        subscriptionPlanId: String(subscription_plan_id),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

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
        const subscriptionPlanId = Number(session.metadata?.subscriptionPlanId);
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
            subscription_plan_id: subscriptionPlanId,
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
    res.status(500).json({ message: "Webhook processing failed" });
  }
};
