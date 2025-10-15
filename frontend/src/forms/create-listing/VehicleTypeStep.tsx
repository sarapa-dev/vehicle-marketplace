import { useCategories, useSubcategories } from "@/hooks/useCategory";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ArrowRight } from "lucide-react";
import type { CreateListingFormData } from "@/pages/CreateListingPage";

type Props = {
  onNext: () => void;
};

const VehicleTypeStep = ({ onNext }: Props) => {
  const { control, watch, setValue } = useFormContext<CreateListingFormData>();
  const currentCategoryId = watch("category_id");
  const selectedParentId = watch("parent_category_id");

  const { categories } = useCategories();
  const { subcategories } = useSubcategories(selectedParentId!);

  function handleParentChange(value: string) {
    setValue("parent_category_id", Number(value));
    setValue("category_id", 0);
    setValue("features", []);
  }

  const canProceed = currentCategoryId && selectedParentId;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Type</CardTitle>
        <CardDescription>Select the type and sub-type of vehicle you're listing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="vehicle-type">Vehicle Type</Label>
          <Select
            value={selectedParentId ? String(selectedParentId) : ""}
            onValueChange={handleParentChange}
          >
            <SelectTrigger id="vehicle-type">
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((c) => (
                <SelectItem key={c.category_id} value={String(c.category_id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedParentId && (
          <FormField
            control={control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="vehicle-subtype">Vehicle Sub-Type</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger id="vehicle-subtype">
                      <SelectValue placeholder="Select sub-type" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((s) => (
                        <SelectItem key={s.category_id} value={String(s.category_id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end pt-4">
          <Button type="button" onClick={onNext} disabled={!canProceed}>
            Next
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleTypeStep;
