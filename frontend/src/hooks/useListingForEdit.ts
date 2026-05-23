import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { ListingForEdit } from "@/types/listings";

export const useListingForEdit = (listingId: number | undefined) => {
  const getListingForEdit = async (): Promise<ListingForEdit> => {
    const res = await axiosInstance<ListingForEdit>(`/listings/${listingId}`);
    return res.data;
  };

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", listingId, "edit"],
    queryFn: getListingForEdit,
    enabled: !!listingId,
  });

  return { listing, isLoading };
};
