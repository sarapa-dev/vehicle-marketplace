import { Heart } from "lucide-react";
import { ListingCard } from "@/components/listings/ListingCard";
import { useFavoritesList } from "@/hooks/useFavoritesList";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
      <Heart className="size-7 text-muted-foreground" />
    </div>
    <p className="text-lg font-semibold text-foreground">No saved listings</p>
    <p className="mt-1 text-sm text-muted-foreground">
      Tap the heart on any listing to save it here
    </p>
  </div>
);

export default function FavoritesPage() {
  const { favorites, isLoading } = useFavoritesList();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:min-h-125">
      <div className="mb-6 flex items-center gap-2">
        <Heart className="size-5 text-rose-500 fill-rose-500" />
        <h1 className="text-xl font-semibold text-foreground">Saved Listings</h1>
        {!isLoading && favorites.length > 0 && (
          <span className="ml-1 text-sm text-muted-foreground">({favorites.length})</span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {favorites.length === 0 ? (
          <EmptyState />
        ) : (
          favorites.map((listing) => (
            <ListingCard key={listing.listing_id} variant="horizontal" listing={listing} />
          ))
        )}
      </div>
    </div>
  );
}
