export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
  postal_address?: string;
  created_at: string;
}

export type UserProfile = Omit<User, "password">;

export interface UpdateUserProfilePayload {
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  postal_address?: string | null;
}
