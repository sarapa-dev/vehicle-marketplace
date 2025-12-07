export interface SubscriptionPlan {
  subscription_plan_id: number;
  name: string;
  description: string;
  max_listings: number;
  price_cents: number;
  billing_interval: string;
}

export interface CurrentSubscription {
  user_subscription_id: number;
  status: "active" | "canceled" | "past_due";
  start_date: string;
  end_date: string | null;
  subscription_plan: {
    name: string;
  };
}
