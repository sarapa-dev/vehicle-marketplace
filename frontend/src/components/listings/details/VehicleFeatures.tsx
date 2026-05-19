import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { ListingFeature } from "@/types/listings";

interface VehicleFeaturesProps {
  features: ListingFeature[];
}

export function VehicleFeatures({ features }: VehicleFeaturesProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features & Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {features.map((item) => (
            <div key={item.listing_feature_id} className="flex items-center gap-2">
              <Check className="size-4 text-green-600 shrink-0" />
              <span className="text-sm">{item.feature.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
