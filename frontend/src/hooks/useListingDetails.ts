import { axiosInstance } from "@/lib/axios";
import { type ListingDetail } from "@/types/listings";
import { useQuery } from "@tanstack/react-query";

export const useListingDetails = (listingId: string | undefined) => {
  const getListing = async (): Promise<ListingDetail> => {
    const res = await axiosInstance<ListingDetail>(`/listings/${listingId}`);
    return res.data;
  };

  const {
    data: listing,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: getListing,
    enabled: !!listingId,
  });

  return { listing, isLoading, isError, error };
};
