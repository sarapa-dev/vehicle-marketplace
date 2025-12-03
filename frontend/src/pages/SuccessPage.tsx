import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md border-border">
        <div className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <CheckCircle className="size-16 text-primary relative" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Your subscription has been activated. You now have access to all Premium features.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-foreground mb-3">What's next?</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Create additional vehicle listings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Access featured listing options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>Reach more potential buyers</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link to="/create-listing" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90">Create Your Listing</Button>
            </Link>
            <Link to="/" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </main>
  );
}
