import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { AdminTable } from "@/features/admins/components/admin-table";

export default async function AdminsPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (
    user?.email !==
    "gkasmiro@gmail.com"
  ) {
    redirect("/admin");
  }

  const { data: admins } =
  await supabase
    .from("profiles")
    .select("*")
    .eq("role", "ADMIN");

const { data: clients } =
  await supabase
    .from("profiles")
    .select("*")
    .eq("role", "CLIENT");

  return (
    <PageContainer>
      <PageHeader
        title="Admin Management"
        description="Manage platform administrators."
      />
      <AdminTable
            admins={admins ?? []}
            clients={clients ?? []}
            />
    </PageContainer>
  );
}