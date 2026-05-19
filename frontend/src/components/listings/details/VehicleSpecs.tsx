import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Gauge, Fuel, Settings, Car, Palette, Zap, CircleDot } from "lucide-react";
import type { ListingDetail } from "@/types/listings";
import { formatMileage, capitalizeFirst, formatDisplacement } from "@/lib/formatters";

interface VehicleSpecsProps {
  listing: ListingDetail;
}

interface SpecItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function SpecItem({ icon, label, value }: SpecItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

export function VehicleSpecs({ listing }: VehicleSpecsProps) {
  const { year, mileage, engine, category } = listing;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          <SpecItem icon={<Calendar className="size-5" />} label="Year" value={year.toString()} />
          <SpecItem
            icon={<Gauge className="size-5" />}
            label="Mileage"
            value={formatMileage(mileage)}
          />
          <SpecItem
            icon={<Fuel className="size-5" />}
            label="Fuel Type"
            value={capitalizeFirst(engine.fuel)}
          />
          <SpecItem
            icon={<Settings className="size-5" />}
            label="Transmission"
            value={capitalizeFirst(engine.transmission)}
          />
          <SpecItem icon={<Car className="size-5" />} label="Body Type" value={category.name} />
          <SpecItem
            icon={<Zap className="size-5" />}
            label="Power"
            value={`${engine.horsepower} HP`}
          />
          <SpecItem
            icon={<CircleDot className="size-5" />}
            label="Engine"
            value={formatDisplacement(engine.displacement)}
          />
          <SpecItem
            icon={<Palette className="size-5" />}
            label="Euro Standard"
            value={engine.euro_standard}
          />
        </div>
      </CardContent>
    </Card>
  );
}
