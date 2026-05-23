import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

import VehicleTypeStep from "@/forms/create-listing/VehicleTypeStep";
import DetailsStep from "@/forms/create-listing/DetailsStep";
import FeaturesStep from "@/forms/create-listing/FeaturesStep";
import ImageUploadStep from "@/forms/create-listing/ImageUploadStep";

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

export default function CreateListingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const form = useForm<CreateListingFormData>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    defaultValues: {
      features: [],
      images: [],
    },
  });

  const onSubmit = async (data: CreateListingFormData) => {
    setIsSubmitting(true);
    try {
      // Remove parent_category_id, since it's not needed for backend
      const { parent_category_id, ...submitData } = data;
      const res = await axiosInstance.post<{ message: string }>("/listings", submitData);

      toast.success(res.data.message, {
        position: "top-left",
      });
      navigate("/");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing. Please try again.");
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
          <h1 className="text-balance text-3xl font-bold mb-2">Create Vehicle Listing</h1>
          <p className="text-pretty text-muted-foreground">
            Fill in the details to list your vehicle for sale
          </p>
        </div>

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
