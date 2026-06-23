import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";

import { columns } from "@/features/invoices/columns";

import { getInvoices } from "@/features/invoices/actions/get-invoices";
import { getClients } from "@/features/invoices/actions/get-clients";
import { getProjects } from "@/features/invoices/actions/get-projects";

import { CreateInvoiceDialog } from "@/features/invoices/components/create-invoice-dialog";

export default async function InvoicesPage() {
  const [invoices, clients, projects] =
    await Promise.all([
      getInvoices(),
      getClients(),
      getProjects(),
    ]);

  return (
    <PageContainer>
      <PageHeader
        title="Invoices"
        description="Manage client invoices"
        action={
          <CreateInvoiceDialog
            clients={clients}
            projects={projects}
          />
        }
      />

      <DataTable
        columns={columns}
        data={invoices}
        searchPlaceholder="Search invoices..."
      />
    </PageContainer>
  );
}