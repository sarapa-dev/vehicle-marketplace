import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ListingDetail } from "@/types/listings";

interface VehicleDescriptionProps {
  listing: ListingDetail;
}

export function VehicleDescription({ listing }: VehicleDescriptionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {listing.description || "No description provided."}
        </p>
      </CardContent>
    </Card>
  );
}
