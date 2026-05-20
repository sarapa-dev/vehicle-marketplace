import { useState } from "react";
import { Mail, Phone, MapPin, Calendar, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateUserProfile } from "@/hooks/useUser";
import type { UserProfile, UpdateUserProfilePayload } from "@/types/user";

interface UserProfileCardProps {
  profile: UserProfile;
}

function formatMemberSince(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<UpdateUserProfilePayload>({
    first_name: profile.first_name,
    last_name: profile.last_name,
    phone_number: profile.phone_number,
    postal_address: profile.postal_address,
  });

  const { updateProfile, isPending } = useUpdateUserProfile(profile.user_id);

  function handleChange(field: keyof UpdateUserProfilePayload, value: string) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleCancel() {
    setFormValues({
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone_number: profile.phone_number,
      postal_address: profile.postal_address,
    });
    setIsEditing(false);
  }

  function handleSave() {
    updateProfile(formValues, {
      onSuccess: () => setIsEditing(false),
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
            <Pencil className="size-3.5" />
            Edit
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-foreground">First Name</Label>
            <Input
              value={isEditing ? formValues.first_name : profile.first_name}
              readOnly={!isEditing}
              onChange={(e) => handleChange("first_name", e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-foreground">Last Name</Label>
            <Input
              value={isEditing ? formValues.last_name : profile.last_name}
              readOnly={!isEditing}
              onChange={(e) => handleChange("last_name", e.target.value)}
              placeholder="Enter last name"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-foreground">Email</Label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
            <Input className="pl-9" value={profile.email} readOnly disabled />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-foreground">Phone</Label>
          <div className="relative flex items-center">
            <Phone className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9"
              value={isEditing ? (formValues.phone_number ?? "") : (profile.phone_number ?? "")}
              readOnly={!isEditing}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              placeholder={isEditing ? "Enter phone number" : "Not provided"}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-foreground">Location</Label>
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9"
              value={isEditing ? (formValues.postal_address ?? "") : (profile.postal_address ?? "")}
              readOnly={!isEditing}
              onChange={(e) => handleChange("postal_address", e.target.value)}
              placeholder={isEditing ? "Enter location" : "Not provided"}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-sm font-semibold text-foreground">Member Since</Label>
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9"
              value={formatMemberSince(profile.created_at)}
              readOnly
              disabled
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center gap-3 pt-1">
            <Button onClick={handleSave} disabled={isPending} className="gap-2">
              <Check className="size-4" />
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isPending} className="gap-2">
              <X className="size-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function UserProfileCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
