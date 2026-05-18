import { SearchBar } from "@/components/search/SearchBar";
import { ListingCard } from "@/components/listings/ListingCard";
import { PaginationControls } from "@/components/search/PaginationControls";
import { useSearchListings } from "@/hooks/useSearchListings";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal } from "lucide-react";

const HorizontalCardSkeleton = () => (
  <div className="flex flex-col sm:flex-row h-auto sm:h-36 rounded-xl overflow-hidden border border-border bg-card">
    <Skeleton className="w-full aspect-video sm:aspect-auto sm:w-56 lg:w-64 shrink-0" />
    <div className="flex flex-1 flex-col justify-between p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-7 w-24 shrink-0" />
      </div>
      <div className="flex gap-4 mt-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
      <SlidersHorizontal className="size-7 text-muted-foreground" />
    </div>
    <p className="text-lg font-semibold text-foreground">No vehicles found</p>
    <p className="mt-1 text-sm text-muted-foreground">
      Try adjusting or clearing your search filters
    </p>
  </div>
);

export default function SearchPage() {
  const { listings, total, totalPages, isLoading } = useSearchListings();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="mb-4 h-5">
        {!isLoading && total > 0 && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{total.toLocaleString("de-DE")}</span>{" "}
            {total === 1 ? "listing" : "listings"} found
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <HorizontalCardSkeleton key={i} />)
        ) : listings.length === 0 ? (
          <EmptyState />
        ) : (
          listings.map((listing) => (
            <ListingCard key={listing.listing_id} variant="horizontal" listing={listing} />
          ))
        )}
      </div>

      {!isLoading && <PaginationControls total={total} totalPages={totalPages} />}
    </div>
  );
}
