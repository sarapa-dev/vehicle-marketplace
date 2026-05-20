import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile, useUserListings } from "@/hooks/useUser";
import { ListingCard } from "@/components/listings/ListingCard";
import { formatDate } from "@/lib/formatters";
import type { UserProfile } from "@/types/user";

function UserProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Skeleton className="h-9 w-24 mb-6" />
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-56" />
        </CardContent>
      </Card>
      <Skeleton className="h-7 w-32 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  );
}

function UserProfileCard({ userProfile }: { userProfile: UserProfile }) {
  const fullName = `${userProfile.first_name} ${userProfile.last_name}`;

  return (
    <Card className="mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="size-8" />
          </div>
          <div>
            <CardTitle className="text-2xl">{fullName}</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <Calendar className="size-4" />
              Member since {formatDate(userProfile.created_at)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="size-4 text-muted-foreground shrink-0" />
            <span className="text-foreground">{userProfile.email}</span>
          </div>
          {userProfile.phone_number && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="size-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{userProfile.phone_number}</span>
            </div>
          )}
          {userProfile.postal_address && (
            <div className="flex items-center gap-3 text-sm sm:col-span-2">
              <MapPin className="size-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{userProfile.postal_address}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function UserListingsSection({ userId }: { userId: string }) {
  const { listings, isLoading, error } = useUserListings(userId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Failed to load listings</p>
      </Card>
    );
  }

  if (listings.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Car className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No listings yet</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <ListingCard key={listing.listing_id} variant="horizontal" listing={listing} />
      ))}
    </div>
  );
}

export default function SellerListingsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.id as string;

  const { userProfile, isLoading, error } = useUserProfile(userId);

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  if (error || !userProfile) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="..">
            <ArrowLeft className="mr-2 size-4" />
            Back to home page
          </Link>
        </Button>
        <Card className="p-8">
          <p className="text-center text-muted-foreground">User not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="ghost" className="mb-6" onClick={handleGoBack}>
        <ArrowLeft className="mr-2 size-4" />
        Back
      </Button>

      <UserProfileCard userProfile={userProfile} />

      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Car className="size-5" />
          Listings
        </h2>
      </div>

      <UserListingsSection userId={userId} />
    </div>
  );
}
