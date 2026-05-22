import { Link } from "react-router";
import { Calendar, Gauge, Fuel, Settings2, TrendingDown, Crown, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchListing, AnyListing } from "@/types/listings";
import { isSoldListing } from "@/types/listings";
import { formatPrice, formatMileage } from "@/lib/formatters";
import { useFavorite } from "@/hooks/useFavorite";
import { useAuthStore } from "@/store/auth.store";

const calcDiscountPercent = (original: number, current: number) =>
  Math.round(((original - current) / original) * 100);

interface FavoriteButtonProps {
  listingId: number;
  isFavorite: boolean;
  className?: string;
}

const FavoriteButton = ({ listingId, isFavorite, className }: FavoriteButtonProps) => {
  const { toggle, isPending } = useFavorite();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(listingId, isFavorite);
      }}
      disabled={isPending}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex items-center justify-center rounded-full",
        "bg-white/80 dark:bg-black/50 backdrop-blur-sm",
        "border border-border/40 dark:border-transparent",
        "transition-all hover:bg-white dark:hover:bg-black/70 disabled:opacity-50",
        "shadow-sm",
        className,
      )}
    >
      <Heart
        className={cn(
          "size-4 transition-colors",
          isFavorite ? "fill-rose-500 text-rose-500" : "text-muted-foreground dark:text-white",
        )}
      />
    </button>
  );
};

interface GridCardProps {
  variant: "grid";
  listing: AnyListing;
  showDiscount?: boolean;
  isSold?: boolean;
  className?: string;
}

interface HorizontalCardProps {
  variant: "horizontal";
  listing: SearchListing;
  className?: string;
}

type ListingCardProps = GridCardProps | HorizontalCardProps;

const GridCard = ({ listing, showDiscount, isSold, className }: Omit<GridCardProps, "variant">) => {
  const user = useAuthStore((s) => s.user);
  const imageUrl = listing.listing_photo?.[0]?.url ?? "/placeholder-car.jpg";

  const sold = isSoldListing(listing);
  const currentPrice = sold ? listing.listing_sale.sale_price : listing.listing_price?.[0]?.price;
  const originalPrice = !sold ? listing.listing_price?.[1]?.price : undefined;

  const discountPercent =
    showDiscount && originalPrice && currentPrice
      ? calcDiscountPercent(originalPrice, currentPrice)
      : null;

  return (
    <Link
      to={`/listings/${listing.listing_id}`}
      className={cn(
        "group relative flex flex-col rounded-xl overflow-hidden border border-border bg-card",
        "transition-all duration-200 hover:border-border/60 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:-translate-y-0.5",
        isSold && "opacity-75",
        className,
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercent && (
            <span className="flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
              <TrendingDown className="size-3" />-{discountPercent}%
            </span>
          )}
          {isSold && (
            <span className="rounded-md bg-zinc-800/90 px-2 py-0.5 text-xs font-semibold text-zinc-300">
              Sold
            </span>
          )}
        </div>

        {/* Favorite button — top-right, authenticated users only */}
        {user && !sold && (
          <FavoriteButton
            listingId={listing.listing_id}
            isFavorite={listing.is_favorite ?? false}
            className="absolute top-2 right-2 size-7"
          />
        )}
      </div>

      <div className="flex flex-col gap-1 p-3">
        <p className="truncate text-sm font-medium text-foreground leading-snug">{listing.title}</p>

        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-col">
            {originalPrice && showDiscount ? (
              <>
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
                <span className="text-base font-bold text-foreground">
                  {currentPrice ? formatPrice(currentPrice) : "—"}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-foreground">
                {currentPrice ? formatPrice(currentPrice) : "Price on request"}
              </span>
            )}
          </div>

          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            {listing.year}
          </span>
        </div>
      </div>
    </Link>
  );
};

// used for search results page - with extended fields
const HorizontalCard = ({ listing, className }: Omit<HorizontalCardProps, "variant">) => {
  const user = useAuthStore((s) => s.user);
  const imageUrl = listing.listing_photo?.[0]?.url ?? "/placeholder-car.jpg";
  const currentPrice = listing.listing_price?.[0]?.price;

  return (
    <Link
      to={`/listings/${listing.listing_id}`}
      className={cn(
        "group relative flex flex-col sm:flex-row rounded-xl overflow-hidden border border-border bg-card",
        "transition-all duration-200 hover:border-border/60 hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30",
        className,
      )}
    >
      <div className="relative w-full aspect-video sm:aspect-auto sm:w-52 lg:w-64 shrink-0 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {listing.is_promoted && (
          <span className="absolute top-2 left-2 flex items-center gap-1 rounded-md bg-amber-500 px-2 py-0.5 text-xs font-semibold text-black">
            <Crown className="size-3" />
            Featured
          </span>
        )}
      </div>

      <div className="relative flex flex-1 flex-col min-w-0 p-4">
        {user && (
          <FavoriteButton
            listingId={listing.listing_id}
            isFavorite={listing.is_favorite ?? false}
            className="absolute top-3 right-3 size-8"
          />
        )}

        <div className="pr-10">
          <p className="text-xs font-medium text-muted-foreground truncate uppercase tracking-wide">
            {listing.manufacturer?.name}
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground leading-snug group-hover:text-foreground/70 transition-colors truncate">
            {listing.title}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{listing.year}</p>
        </div>

        <div className="mt-auto pt-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {listing.mileage !== undefined && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Gauge className="size-4 shrink-0" />
                {formatMileage(listing.mileage)}
              </span>
            )}
            {listing.engine?.fuel && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground capitalize">
                <Fuel className="size-4 shrink-0" />
                {listing.engine.fuel}
              </span>
            )}
            {listing.engine?.transmission && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground capitalize">
                <Settings2 className="size-4 shrink-0" />
                {listing.engine.transmission}
              </span>
            )}
            {listing.engine?.displacement && (
              <span className="text-sm text-muted-foreground">
                {(listing.engine.displacement / 1000).toFixed(1)}L
              </span>
            )}
            {listing.engine?.horsepower && (
              <span className="text-sm text-muted-foreground">{listing.engine.horsepower} hp</span>
            )}
          </div>

          <p className="shrink-0 text-lg font-bold text-foreground sm:text-xl">
            {currentPrice ? formatPrice(currentPrice) : "On request"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export const ListingCard = (props: ListingCardProps) => {
  if (props.variant === "horizontal") {
    const { variant: _, ...rest } = props;
    return <HorizontalCard {...rest} />;
  }
  const { variant: _, ...rest } = props;
  return <GridCard {...rest} />;
};
