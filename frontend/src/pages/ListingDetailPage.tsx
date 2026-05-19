import { useParams, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { useListingDetails } from "@/hooks/useListingDetails";
import { ImageGallery } from "@/components/listings/details/ImageGallery";
import { SellerInfo } from "@/components/listings/details/SellerInfo";
import { VehicleSpecs } from "@/components/listings/details/VehicleSpecs";
import { VehicleDescription } from "@/components/listings/details/VehicleDescription";
import { VehicleFeatures } from "@/components/listings/details/VehicleFeatures";
import { AdditionalInfo } from "@/components/listings/details/AdditionalInfo";
import { ListingHeader } from "@/components/listings/details/ListingHeader";
import { ListingDetailSkeleton } from "@/components/listings/details/ListingDetailSkeleton";

export default function ListingDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const listingId = params?.id as string;

  const { listing, isLoading, isError, error } = useListingDetails(listingId);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <ListingDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="text-destructive mb-4 h-12 w-12" />
            <h2 className="mb-2 text-xl font-semibold">Failed to load listing</h2>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "An unexpected error occurred"}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="text-muted-foreground mb-4 h-12 w-12" />
            <h2 className="mb-2 text-xl font-semibold">Listing not found</h2>
            <p className="text-muted-foreground">
              The listing you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const vehicleName = `${listing.year} ${listing.manufacturer.name} ${listing.title}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>

        <div className="mb-6">
          <ListingHeader listing={listing} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ImageGallery photos={listing.listing_photo} title={vehicleName} />
          </div>

          <div className="lg:col-span-1">
            <div>
              <SellerInfo user={listing.user} listingTitle={vehicleName} />
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <VehicleSpecs listing={listing} />
          <VehicleDescription listing={listing} />
          <VehicleFeatures features={listing.listing_feature} />
          <AdditionalInfo listing={listing} />
        </div>
      </div>
    </div>
  );
}
