import { axiosInstance } from "@/lib/axios";
import type { User } from "@/types/user";
import { toast } from "sonner";
import { create } from "zustand";

type RegisterType = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  checkUser: () => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  registerUser: (data: RegisterType) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<UserState>()((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  isInitialized: false,

  checkUser: async () => {
    try {
      const res = await axiosInstance.get<User>("/auth/me");
      set({ user: res.data, isLoggedIn: true, isInitialized: true, isLoading: false });
    } catch {
      set({ user: null, isLoggedIn: false, isLoading: false, isInitialized: false });
    }
  },

  login: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post<User>("/auth/login", data);
      set({ user: res.data, isLoggedIn: true, isLoading: false, isInitialized: true });
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
      set({ user: null, isLoggedIn: false, isLoading: false });
    }
  },

  registerUser: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post<User>("/auth/register", data);
      set({ user: res.data, isLoggedIn: true, isLoading: false, isInitialized: true });
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Register failed");
      set({ user: null, isLoggedIn: false, isLoading: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null, isLoggedIn: false });
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  },
}));
