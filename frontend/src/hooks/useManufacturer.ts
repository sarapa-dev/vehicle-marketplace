import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { Manufacturer } from "@/types/manufacturer";

export const useManufacturers = () => {
  const getManufacturers = async (): Promise<Manufacturer[]> => {
    const res = await axiosInstance<Manufacturer[]>("/manufacturers");
    return res.data;
  };

  const { data: manufacturers = [], isLoading } = useQuery<Manufacturer[]>({
    queryKey: ["manufacturers"],
    queryFn: getManufacturers,
  });

  return { manufacturers, isLoading };
};
