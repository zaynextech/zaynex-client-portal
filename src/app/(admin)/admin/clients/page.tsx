import Link from "next/link";

import { Button } from "@/components/ui/button";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";

import { columns } from "@/features/clients/columns";
import { getClients } from "@/features/clients/actions";

export default async function ClientsPage() {
  const clients =
    await getClients();

  return (
    <PageContainer>
      <PageHeader
        title="Clients"
        description="Manage agency clients"
        action={
          <Button asChild>
            <Link href="/admin/clients/new">
              Add Client
            </Link>
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={clients}
        searchPlaceholder="Search clients..."
      />
    </PageContainer>
  );
}