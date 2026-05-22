import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { SearchListing } from "@/types/listings";

export const useFavoritesList = () => {
  const getFavorites = async (): Promise<SearchListing[]> => {
    const res = await axiosInstance<SearchListing[]>("/favorites");
    return res.data;
  };

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  return { favorites, isLoading };
};
