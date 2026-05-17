import { axiosInstance } from "@/lib/axios";
import { type BaseListing } from "@/types/listings";
import { useQuery } from "@tanstack/react-query";

export const useFeaturedListings = () => {
  const getFeaturedListings = async (): Promise<BaseListing[]> => {
    const res = await axiosInstance<BaseListing[]>("/listings/featured");
    return res.data;
  };

  const {
    data: featuredListings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listings", "featured"],
    queryFn: getFeaturedListings,
  });

  return { featuredListings, isLoading, error };
};

export const useDiscountedListings = () => {
  const getDiscountedListings = async (): Promise<BaseListing[]> => {
    const res = await axiosInstance<BaseListing[]>("/listings/discounted");
    return res.data;
  };

  const {
    data: discountedListings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listings", "discounted"],
    queryFn: getDiscountedListings,
  });

  return { discountedListings, isLoading, error };
};

export const useRecentlySoldListings = () => {
  const getRecentlySoldListings = async (): Promise<BaseListing[]> => {
    const res = await axiosInstance<BaseListing[]>("/listings/recently-sold");
    return res.data;
  };

  const {
    data: recentlySoldListings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listings", "recently-sold"],
    queryFn: getRecentlySoldListings,
  });

  return { recentlySoldListings, isLoading, error };
};
