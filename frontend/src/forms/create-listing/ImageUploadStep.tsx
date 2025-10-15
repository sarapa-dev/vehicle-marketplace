import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import type { CreateListingFormData } from "@/pages/CreateListingPage";

type Props = {
  onBack: () => void;
  isSubmitting: boolean;
};

const ImageUploadStep = ({ onBack, isSubmitting }: Props) => {
  const { control, watch, setValue } = useFormContext<CreateListingFormData>();
  const imageValue = watch("image");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) return;

    if (file.size > 5 * 1024 * 1024) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setValue("image", base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setValue("image", "");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Photo</CardTitle>
        <CardDescription>Add a photo of your vehicle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Vehicle Photo</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {!imageValue ? (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                      <Upload className="mx-auto size-12 text-muted-foreground mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Click to upload</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (max 5MB)</p>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button type="button" variant="secondary" className="mt-4" asChild>
                          <span>Select Image</span>
                        </Button>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                        <img
                          src={imageValue || "/placeholder.svg"}
                          alt="Vehicle preview"
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Listing"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploadStep;
