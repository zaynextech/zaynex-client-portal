import { createClient } from "@/lib/supabase/server";
import { AdminTable } from "@/features/admins/components/admin-table";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

export default async function AdminsPage() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .order("full_name", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <PageContainer>
      <PageHeader
        title="User Management"
        description="Manage user roles and access permissions."
      />

      <AdminTable users={users ?? []} />
    </PageContainer>
  );
}