import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BaseListing } from "@/types/listings";

const RowCardSkeleton = () => (
  <div className="flex w-50 shrink-0 flex-col rounded-xl overflow-hidden border border-border bg-card">
    <Skeleton className="aspect-4/3 w-full" />
    <div className="flex flex-col gap-2 p-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-5 w-20" />
    </div>
  </div>
);

interface ListingsRowProps {
  title: string;
  listings: BaseListing[];
  isLoading: boolean;
  showDiscount?: boolean;
  isSold?: boolean;
  viewAllHref?: string;
  className?: string;
}

export const ListingsRow = ({
  title,
  listings,
  isLoading,
  showDiscount = false,
  isSold = false,
  viewAllHref,
  className,
}: ListingsRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!isLoading && listings.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className={cn("w-full", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mr-2"
            >
              View all →
            </a>
          )}
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-full"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-full"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <RowCardSkeleton key={i} />)
          : listings.map((listing) => (
              <div key={listing.listing_id} className="w-50 shrink-0">
                <ListingCard
                  variant="grid"
                  listing={listing}
                  showDiscount={showDiscount}
                  isSold={isSold}
                />
              </div>
            ))}
      </div>
    </section>
  );
};
