import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export const useDeleteListing = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteListing, isPending } = useMutation({
    mutationFn: (listingId: number) => axiosInstance.delete(`/listings/${listingId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userListings"] });
      toast.success("Listing deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete listing");
    },
  });

  return { deleteListing, isPending };
};
