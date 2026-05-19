import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ListingDetail } from "@/types/listings";

interface AdditionalInfoProps {
  listing: ListingDetail;
}

interface InfoRowProps {
  label: string;
  value: string | number | null;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between border-b py-3 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "N/A"}</span>
    </div>
  );
}

export function AdditionalInfo({ listing }: AdditionalInfoProps) {
  const { engine, manufacturer } = listing;

  const formatDisplacement = (cc: number) => {
    return (cc / 1000).toFixed(1) + "L";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          <InfoRow label="Manufacturer" value={manufacturer.name} />
          <InfoRow label="Engine Size" value={formatDisplacement(engine.displacement)} />
          <InfoRow label="Horsepower" value={`${engine.horsepower} HP`} />
          <InfoRow label="Euro Standard" value={engine.euro_standard} />
        </div>
      </CardContent>
    </Card>
  );
}
