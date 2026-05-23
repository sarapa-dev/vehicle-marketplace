import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

import VehicleTypeStep from "@/forms/create-listing/VehicleTypeStep";
import DetailsStep from "@/forms/create-listing/DetailsStep";
import FeaturesStep from "@/forms/create-listing/FeaturesStep";
import ImageUploadStep from "@/forms/create-listing/ImageUploadStep";
import { useListingForEdit } from "@/hooks/useListingForEdit";
import type { ListingForEdit } from "@/types/listings";

const formSchema = z.object({
  title: z.string({ error: "Title is required" }).min(1),
  description: z.string({ error: "Description is required" }),
  year: z
    .number({ error: "Year is required" })
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  mileage: z.number({ error: "Mileage is required" }),
  category_id: z.number({ error: "Category is required" }),
  parent_category_id: z.number().optional(),
  manufacturer_id: z.number({ error: "Manufacturer is required" }),
  displacement: z.number({ error: "Displacement is required" }),
  fuel: z.enum(["petrol", "diesel", "hybrid", "electric"], { error: "Fuel type is required" }),
  horsepower: z.number({ error: "Horsepower is required" }),
  euro_standard: z.enum(["EURO 4", "EURO 5", "EURO 6", "EURO 7"], {
    error: "Euro standard is required",
  }),
  transmission: z.enum(["manual", "automatic"], { error: "Transmission type is required" }),
  features: z.array(z.number()).nonempty("Select at least one feature"),
  price: z.number({ error: "Price is required" }),
  images: z.array(z.string()).nonempty("Upload at least one image"),
});

export type CreateListingFormData = z.infer<typeof formSchema>;

const mapListingToDefaults = (listing: ListingForEdit): Partial<CreateListingFormData> => ({
  title: listing.title,
  description: listing.description,
  year: listing.year,
  mileage: listing.mileage,
  category_id: listing.category.category_id,
  parent_category_id: listing.category.parent__category_id ?? undefined,
  manufacturer_id: listing.manufacturer.manufacturer_id,
  displacement: listing.engine.displacement ?? undefined,
  fuel: listing.engine.fuel as CreateListingFormData["fuel"],
  horsepower: listing.engine.horsepower,
  euro_standard: listing.engine.euro_standard as CreateListingFormData["euro_standard"],
  transmission: listing.engine.transmission as CreateListingFormData["transmission"],
  features: listing.listing_feature.map((lf) => lf.feature.feature_id) as [number, ...number[]],
  price: listing.listing_price[0]?.price ?? 0,
  // Existing Cloudinary URLs — ImageUploadStep shows them as previews,
  // backend distinguishes them from new base64 uploads
  images: listing.listing_photo.map((p) => p.url) as [string, ...string[]],
});

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      {[1, 2, 3, 4].map((step, index) => (
        <div key={step} className={`flex items-center ${index < 3 ? "flex-1" : ""}`}>
          <div
            className={`flex items-center justify-center size-10 rounded-full border-2 transition-colors ${
              currentStep >= step
                ? "bg-primary border-primary text-primary-foreground"
                : "border-muted-foreground text-muted-foreground"
            }`}
          >
            {step}
          </div>
          {step < 4 && (
            <div
              className={`flex-1 h-1 mx-2 transition-colors ${
                currentStep > step ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

interface ListingFormProps {
  isEditMode: boolean;
  listingId?: number;
  listing?: ListingForEdit;
}

function ListingForm({ isEditMode, listingId, listing }: ListingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const defaultValues: Partial<CreateListingFormData> =
    isEditMode && listing ? mapListingToDefaults(listing) : { features: [], images: [] };

  const form = useForm<CreateListingFormData>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    defaultValues,
  });

  const onSubmit = async (data: CreateListingFormData) => {
    setIsSubmitting(true);
    try {
      const { parent_category_id, ...submitData } = data;

      if (isEditMode) {
        const res = await axiosInstance.patch<{ message: string }>(
          `/listings/${listingId}`,
          submitData,
        );
        toast.success(res.data.message, { position: "top-left" });
        navigate(`/listings/${listingId}`);
      } else {
        const res = await axiosInstance.post<{ message: string }>("/listings", submitData);
        toast.success(res.data.message, { position: "top-left" });
        navigate("/");
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error submitting listing:", error);
      toast.error(
        isEditMode
          ? "Failed to update listing. Please try again."
          : "Failed to create listing. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-background py-4 sm:py-8">
      <div className="container mx-auto sm:px-4 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          <h1 className="text-balance text-3xl font-bold mb-2">
            {isEditMode ? "Edit Listing" : "Create Vehicle Listing"}
          </h1>
          <p className="text-pretty text-muted-foreground">
            {isEditMode
              ? "Update your vehicle listing details"
              : "Fill in the details to list your vehicle for sale"}
          </p>
        </div>

        <StepIndicator currentStep={currentStep} />

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === 1 && <VehicleTypeStep onNext={() => setCurrentStep(2)} />}
            {currentStep === 2 && (
              <DetailsStep onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />
            )}
            {currentStep === 3 && (
              <FeaturesStep onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />
            )}
            {currentStep === 4 && (
              <ImageUploadStep onBack={() => setCurrentStep(3)} isSubmitting={isSubmitting} />
            )}
          </form>
        </FormProvider>
      </div>
    </section>
  );
}

export default function CreateListingPage() {
  const { id } = useParams<{ id?: string }>();
  const listingId = id ? Number(id) : undefined;
  const isEditMode = !!listingId;

  const { listing, isLoading } = useListingForEdit(listingId);

  if (isEditMode && isLoading) {
    return (
      <section className="min-h-screen bg-background py-4 sm:py-8">
        <div className="container mx-auto sm:px-4 max-w-4xl">
          <div className="flex items-center justify-center py-24">
            <p className="text-muted-foreground">Loading listing...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    // key ensures ListingForm fully remounts if user navigates
    // between different listing edits without unmounting the page
    <ListingForm
      key={listingId ?? "create"}
      isEditMode={isEditMode}
      listingId={listingId}
      listing={listing}
    />
  );
}
