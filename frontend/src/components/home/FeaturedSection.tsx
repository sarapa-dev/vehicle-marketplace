import { ListingCard } from "@/components/listings/ListingCard";
import { useFeaturedListings } from "@/hooks/useListing";
import { Skeleton } from "@/components/ui/skeleton";

const GridCardSkeleton = () => (
  <div className="flex flex-col rounded-xl overflow-hidden border border-border bg-card">
    <Skeleton className="aspect-4/3 w-full" />
    <div className="flex flex-col gap-2 p-3">
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center justify-between mt-1">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  </div>
);

export const FeaturedSection = () => {
  const { featuredListings, isLoading } = useFeaturedListings();

  if (!isLoading && featuredListings.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Featured Vehicles</h2>
        <a
          href="/search?promoted=true"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all →
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <GridCardSkeleton key={i} />)
          : featuredListings.map((listing) => (
              <ListingCard key={listing.listing_id} variant="grid" listing={listing} />
            ))}
      </div>
    </section>
  );
};
