import { axiosInstance } from "@/lib/axios";
import {
  type Category,
  type Feature,
  type Subcategory,
  type CategoryWithFeatures,
} from "@/types/categories";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  const getCategories = async (): Promise<Category[]> => {
    const res = await axiosInstance<Category[]>("/categories");
    return res.data;
  };

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return { categories };
};

export const useSubcategories = (category_id: number) => {
  const getSubcategories = async (): Promise<Category[]> => {
    const res = await axiosInstance<Subcategory[]>(`/categories/${category_id}`);
    return res.data[0].other_category;
  };

  const { data: subcategories = [] } = useQuery({
    queryKey: ["subcategories", category_id],
    queryFn: getSubcategories,
    enabled: !!category_id,
  });

  return { subcategories };
};

export const useFeatures = (category_id: number) => {
  const getFeatures = async (): Promise<Feature[]> => {
    const res = await axiosInstance<CategoryWithFeatures[]>(`/features/${category_id}`);
    return res.data[0].feature;
  };

  const { data: features } = useQuery({
    queryKey: ["features", category_id],
    queryFn: getFeatures,
    enabled: !!category_id,
  });

  return { features };
};
