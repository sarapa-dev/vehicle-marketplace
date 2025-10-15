import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CreateListingFormData } from "@/pages/CreateListingPage";
import { useFeatures } from "@/hooks/useCategory";

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const FeaturesStep = ({ onNext, onBack }: Props) => {
  const { control, watch } = useFormContext<CreateListingFormData>();
  const parentCategoryId = watch("parent_category_id");

  const { features } = useFeatures(parentCategoryId!);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Features</CardTitle>
        <CardDescription>Choose at least one feature from the list below</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="features"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features?.map((feature) => (
                  <FormField
                    key={feature.feature_id}
                    control={control}
                    name="features"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={feature.feature_id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(feature.feature_id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, feature.feature_id])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== feature.feature_id)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {feature.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
          <Button type="button" onClick={onNext}>
            Next
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturesStep;
