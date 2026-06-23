"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { updateProfile } from "@/features/profile/actions/update-profile";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company_name?: string | null;
  phone?: string | null;
  role?: string | null;
}

interface ProfileFormProps {
  profile: Profile | null;
}

export function ProfileForm({
  profile,
}: ProfileFormProps) {
  const router = useRouter();

  const [editing, setEditing] =
    useState(
      !profile?.full_name
    );

  const [loading, setLoading] =
    useState(false);

  const [fullName, setFullName] =
    useState(
      profile?.full_name || ""
    );

  const [
    companyName,
    setCompanyName,
  ] = useState(
    profile?.company_name ||
      ""
  );

  const [phone, setPhone] =
    useState(
      profile?.phone || ""
    );

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateProfile({
        full_name: fullName,
        company_name:
          companyName,
        phone,
      });

      toast.success(
        "Profile updated"
      );

      setEditing(false);

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!editing && profile) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">
            Full Name
          </p>

          <p className="font-medium">
            {profile.full_name ||
              "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Email
          </p>

          <p className="font-medium">
            {profile.email}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Company
          </p>

          <p className="font-medium">
            {profile.company_name ||
              "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Phone
          </p>

          <p className="font-medium">
            {profile.phone ||
              "-"}
          </p>
        </div>

        <Button
          onClick={() =>
            setEditing(true)
          }
        >
          Edit Profile
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Full Name
        </label>

        <Input
          value={fullName}
          onChange={(e) =>
            setFullName(
              e.target.value
            )
          }
          placeholder="Full Name"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Email
        </label>

        <Input
          value={
            profile?.email || ""
          }
          disabled
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Company Name
        </label>

        <Input
          value={companyName}
          onChange={(e) =>
            setCompanyName(
              e.target.value
            )
          }
          placeholder="Company Name"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Phone Number
        </label>

        <Input
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
          placeholder="+211..."
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </Button>

        {profile && (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setEditing(false)
            }
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}