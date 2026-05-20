import { axiosInstance } from "@/lib/axios";
import type { SearchListing } from "@/types/listings";
import type { UpdateUserProfilePayload, UserProfile } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserProfile = (userId: string | number) => {
  const getUserProfile = async (): Promise<UserProfile> => {
    const res = await axiosInstance.get<UserProfile>(`/user/profile/${userId}`);
    return res.data;
  };

  const {
    data: userProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: getUserProfile,
    enabled: !!userId,
  });

  return { userProfile, isLoading, error };
};

export const useUpdateUserProfile = (userId: string | number) => {
  const queryClient = useQueryClient();

  const updateProfile = async (data: UpdateUserProfilePayload): Promise<UserProfile> => {
    const res = await axiosInstance.put<UserProfile>(`/user/profile/${userId}`, data);
    return res.data;
  };

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
    },
  });

  return { updateProfile: mutate, isPending, isError, isSuccess };
};

export const useUserListings = (userId: string | number) => {
  const getUserListings = async (): Promise<SearchListing[]> => {
    const res = await axiosInstance.get<SearchListing[]>(`/user/${userId}/listings`);
    return res.data;
  };

  const {
    data: listings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userListings", userId],
    queryFn: getUserListings,
    enabled: !!userId,
  });

  return { listings, isLoading, error };
};
