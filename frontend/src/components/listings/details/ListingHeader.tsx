import { Badge } from "@/components/ui/badge";
import type { ListingDetail } from "@/types/listings";
import { formatPrice } from "@/lib/formatters";

interface ListingHeaderProps {
  listing: ListingDetail;
}

export function ListingHeader({ listing }: ListingHeaderProps) {
  const { title, year, manufacturer, listing_price, is_promoted } = listing;

  const currentPrice = listing_price[0]?.price;

  const vehicleName = `${year} ${manufacturer.name} ${title}`;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold md:text-3xl">{vehicleName}</h1>
        {is_promoted && (
          <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
            Featured
          </Badge>
        )}
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-primary md:text-3xl">
          {currentPrice ? formatPrice(currentPrice) : "Price on request"}
        </span>
        {listing_price.length > 1 && (
          <>
            <span className="text-muted-foreground text-lg line-through">
              {formatPrice(listing_price[1].price)}
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Save{" "}
              {Math.round(((listing_price[1].price - currentPrice) / listing_price[1].price) * 100)}
              %
            </Badge>
          </>
        )}
      </div>
    </div>
  );
}
