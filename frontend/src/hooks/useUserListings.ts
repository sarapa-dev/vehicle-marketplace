import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { SearchListing } from "@/types/listings";

export const useUserListings = (userId: number | undefined) => {
  const getUserListings = async (): Promise<SearchListing[]> => {
    const res = await axiosInstance<SearchListing[]>(`/user/${userId}/listings`);
    return res.data;
  };

  const { data: userListings = [], isLoading } = useQuery({
    queryKey: ["userListings", userId],
    queryFn: getUserListings,
    enabled: !!userId,
  });

  return { userListings, isLoading };
};
