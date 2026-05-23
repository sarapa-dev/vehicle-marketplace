import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import type { SubscriptionPlan, CurrentSubscription } from "@/types/subscription";

function SubscriptionPage() {
  const { data: plans, error } = useQuery<SubscriptionPlan[]>({
    queryKey: ["subscriptionPlans"],
    queryFn: async () => {
      const res = await axiosInstance.get<SubscriptionPlan[]>("/subscription");
      return res.data;
    },
  });

  const { data: currentSubscription } = useQuery<CurrentSubscription>({
    queryKey: ["currentSubscription"],
    queryFn: async () => {
      const res = await axiosInstance.get<CurrentSubscription>("/subscription/current");
      return res.data;
    },
  });

  const handleSubscribe = async (planId: number) => {
    try {
      const res = await axiosInstance.post("/subscription/create-checkout-session", {
        subscription_plan_id: planId,
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Error creating checkout session:", err);
    }
  };

  if (error || !plans) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Error Loading Plans</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Start listing vehicles today. Upgrade anytime to reach more buyers and unlock premium
            features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const isCurrentPlan = currentSubscription?.subscription_plan?.name === plan.name;
            const isPremium = plan.name === "Premium";

            return (
              <Card
                key={plan.subscription_plan_id}
                className={`flex flex-col ${
                  isPremium ? "border-primary relative overflow-hidden" : "border-border"
                }`}
              >
                {isPremium && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                    Recommended
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        ${(plan.price_cents / 100).toFixed(0)}
                      </span>
                      <span className="text-muted-foreground">/{plan.billing_interval}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground">
                        Up to {plan.max_listings} vehicle{" "}
                        {plan.max_listings === 1 ? "listing" : "listings"}
                      </span>
                    </div>

                    {plan.name === "Free" && (
                      <>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                          <span className="text-sm text-foreground">Basic seller profile</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                          <span className="text-sm text-foreground">
                            Standard search visibility
                          </span>
                        </div>
                      </>
                    )}

                    {plan.name === "Basic" && (
                      <>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                          <span className="text-sm text-foreground">Featured listings</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                          <span className="text-sm text-foreground">
                            Enhanced search visibility
                          </span>
                        </div>
                      </>
                    )}

                    {plan.name === "Premium" && (
                      <>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                          <span className="text-sm text-foreground">
                            Priority featured listings
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                          <span className="text-sm text-foreground">Top search visibility</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
                          <span className="text-sm text-foreground">Enhanced seller badge</span>
                        </div>
                      </>
                    )}
                  </div>

                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full bg-transparent" disabled>
                      Your Current Plan
                    </Button>
                  ) : (
                    <Button
                      disabled={
                        plan.name === "Free" &&
                        currentSubscription?.subscription_plan?.name !== "Free"
                      }
                      className={`w-full ${
                        isPremium
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-accent hover:bg-accent/90 text-accent-foreground"
                      }`}
                      onClick={() => handleSubscribe(plan.subscription_plan_id)}
                    >
                      {plan.name === "Free" ? "Downgrade" : `Upgrade to ${plan.name}`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time from your account settings. No
                questions asked.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards through our secure Stripe payment processor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SubscriptionPage;
