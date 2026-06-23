import { notFound } from "next/navigation";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { createClient } from "@/lib/supabase/server";

import { ProfileForm } from "@/features/profile/components/profile-form";

export default async function ClientProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

  return (
    <PageContainer>
      <PageHeader
        title="Profile"
        description="Manage your account information"
      />

      <SectionCard title="Profile Information">
        <ProfileForm
          profile={profile}
        />
      </SectionCard>
    </PageContainer>
  );
}