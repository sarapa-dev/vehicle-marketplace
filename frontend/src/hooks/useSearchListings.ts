import { axiosInstance } from "@/lib/axios";
import { type SearchListing } from "@/types/listings";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export interface SearchListingsResponse {
  data: SearchListing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const searchParamsParsers = {
  category_id: parseAsInteger,
  manufacturer_id: parseAsInteger,
  price_min: parseAsInteger,
  price_max: parseAsInteger,
  year_from: parseAsInteger,
  year_to: parseAsInteger,
  fuel: parseAsString,
  transmission: parseAsString,
  page: parseAsInteger.withDefault(1),
};

export const useSearchListings = () => {
  const [params] = useQueryStates(searchParamsParsers);

  const fetchListings = async (): Promise<SearchListingsResponse> => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.set(key, String(value));
      }
    });

    const res = await axiosInstance<SearchListingsResponse>(
      `/listings/search?${queryParams.toString()}`,
    );
    return res.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["listings", "search", params],
    queryFn: fetchListings,
    refetchOnWindowFocus: false,
  });

  return {
    listings: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    currentPage: data?.page ?? 1,
    isLoading,
    error,
  };
};
