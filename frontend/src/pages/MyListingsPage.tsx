import { useState } from "react";
import { useNavigate } from "react-router";
import { LayoutList, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ListingCard } from "@/components/listings/ListingCard";
import { useUserListings } from "@/hooks/useUserListings";
import { useDeleteListing } from "@/hooks/useDeleteListing";
import { useAuthStore } from "@/store/auth.store";
import type { SearchListing } from "@/types/listings";

const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
        <LayoutList className="size-7 text-muted-foreground" />
      </div>
      <p className="text-lg font-semibold text-foreground">No listings yet</p>
      <p className="mt-1 text-sm text-muted-foreground">Create your first listing to get started</p>
      <Button className="mt-4" onClick={() => navigate("/create-listing")}>
        Create Listing
      </Button>
    </div>
  );
};

export default function MyListingsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { userListings } = useUserListings(user?.user_id);
  const { deleteListing, isPending } = useDeleteListing();

  const [pendingDelete, setPendingDelete] = useState<SearchListing | null>(null);

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteListing(pendingDelete.listing_id, {
      onSettled: () => setPendingDelete(null),
    });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutList className="size-5 text-foreground" />
          <h1 className="text-xl font-semibold text-foreground">My Listings</h1>
          {userListings.length > 0 && (
            <span className="text-sm text-muted-foreground">({userListings.length})</span>
          )}
        </div>
        {userListings.length > 0 && (
          <Button size="sm" onClick={() => navigate("/create-listing")}>
            + Create Listing
          </Button>
        )}
      </div>

      {userListings.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-4">
          {userListings.map((listing) => (
            <div key={listing.listing_id} className="flex flex-col gap-1.5">
              <ListingCard variant="horizontal" listing={listing} />

              <div className="flex justify-end gap-2 px-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/listings/${listing.listing_id}/edit`)}
                >
                  <Pencil className="size-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setPendingDelete(listing)}>
                  <Trash2 className="size-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete listing?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">{pendingDelete?.title}</span> will be
              removed from active listings. This can be restored by an administrator if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
