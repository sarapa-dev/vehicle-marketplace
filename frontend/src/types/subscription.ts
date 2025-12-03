export interface SubscriptionPlan {
  subscription_plan_id: number;
  name: string;
  description: string;
  max_listings: number;
  price_cents: number;
  billing_interval: string;
}
