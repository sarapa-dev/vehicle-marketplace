import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router";

export default function CancelPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md border-border">
        <div className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl" />
              <AlertCircle className="size-16 text-destructive relative" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Cancelled</h1>
          <p className="text-muted-foreground mb-6">
            Your payment was cancelled and your subscription was not activated. No charges have been
            made to your account.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-foreground mb-3">You can:</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Try upgrading again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Continue with the Free plan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>Contact our support team for help</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link to="/subscription" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90">Try Again</Button>
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
