import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  ExternalLink,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle,
} from "lucide-react";
import type { UserProfile } from "@/types/user";
import { Link } from "react-router";

interface SellerInfoProps {
  user: UserProfile;
  listingTitle: string;
}

export function SellerInfo({ user, listingTitle }: SellerInfoProps) {
  const [message, setMessage] = useState(
    `Hi, I'm interested in the ${listingTitle}. Is it still available?`,
  );

  const memberSince = new Date(user.created_at).getFullYear();
  const fullName = `${user.first_name} ${user.last_name}`;

  const handleSendMessage = () => {
    // TODO: Implement actual message sending
    console.log("Sending message:", message);
    alert("Message functionality will be implemented with chat backend");
  };

  const handleCallSeller = () => {
    if (user.phone_number) {
      window.location.href = `tel:${user.phone_number}`;
    } else {
      alert("Phone number not available");
    }
  };

  const handleEmailSeller = () => {
    const subject = encodeURIComponent(`Inquiry about ${listingTitle}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${user.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Seller Information</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Verified
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{fullName}</h3>
          </div>

          <div className="text-muted-foreground space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>Member since {memberSince}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>{user.postal_address || "Location not specified"}</span>
            </div>
          </div>

          <Link to={`/seller/${user.user_id}/listings`} target="_blank">
            <Button variant="outline" className="w-full cursor-pointer">
              <ExternalLink className="mr-2 size-4" />
              View All Listings
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="size-5" />
            Contact Seller
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Your Message
            </label>
            <Textarea
              id="message"
              placeholder="I'm interested in this vehicle..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Button className="w-full" onClick={handleSendMessage}>
              <MessageSquare className="mr-2 size-4" />
              Send Message
            </Button>
            <Button variant="outline" className="w-full" onClick={handleCallSeller}>
              <Phone className="mr-2 size-4" />
              Call Seller
            </Button>
            <Button variant="outline" className="w-full" onClick={handleEmailSeller}>
              <Mail className="mr-2 size-4" />
              Email Seller
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
