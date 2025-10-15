import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { Engine } from "@/types/engine";

export const useEngines = () => {
  const getEngines = async (): Promise<Engine[]> => {
    const res = await axiosInstance<Engine[]>("/engines");
    return res.data;
  };

  const { data: engines } = useQuery<Engine[]>({
    queryKey: ["engines"],
    queryFn: getEngines,
  });

  return { engines };
};
