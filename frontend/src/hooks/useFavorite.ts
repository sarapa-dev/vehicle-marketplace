import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const useFavorite = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["listings"] });
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  };

  const handleError = (error: AxiosError<{ message: string }>) => {
    const message = error.response?.data?.message;
    if (error.response?.status === 403) {
      toast.error(message ?? "Cannot favorite your own listing");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const { mutate: addFavorite, isPending: isAdding } = useMutation({
    mutationFn: (listing_id: number) => axiosInstance.post("/favorites", { listing_id }),
    onSuccess: invalidate,
    onError: handleError,
  });

  const { mutate: removeFavorite, isPending: isRemoving } = useMutation({
    mutationFn: (listing_id: number) => axiosInstance.delete(`/favorites/${listing_id}`),
    onSuccess: invalidate,
    onError: handleError,
  });

  const toggle = (listing_id: number, is_favorite: boolean) => {
    if (is_favorite) {
      removeFavorite(listing_id);
    } else {
      addFavorite(listing_id);
    }
  };

  return { toggle, isPending: isAdding || isRemoving };
};
