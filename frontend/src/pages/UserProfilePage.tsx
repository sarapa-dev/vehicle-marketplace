import { UserProfileCard, UserProfileCardSkeleton } from "@/components/user/UserProfileCard";
import { useUserProfile } from "@/hooks/useUser";
import { useAuthStore } from "@/store/auth.store";

export default function UserProfilePage() {
  const { user } = useAuthStore();

  if (!user) {
    return;
  }

  const { userProfile, isLoading, error } = useUserProfile(user?.user_id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage your personal information
        </p>
      </div>

      {isLoading && <UserProfileCardSkeleton />}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
          <p className="text-sm text-destructive-foreground">
            Failed to load profile. Please try again later.
          </p>
        </div>
      )}

      {userProfile && <UserProfileCard profile={userProfile} />}
    </div>
  );
}
