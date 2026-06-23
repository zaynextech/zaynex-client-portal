import { notFound } from "next/navigation";
import Link from "next/link";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { getInvoice } from "@/features/invoices/actions/get-invoice";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvoicePage({
  params,
}: PageProps) {
  const { id } = await params;

  const invoice =
    await getInvoice(id);

  if (!invoice) {
    notFound();
  }

  return (
    <PageContainer>
      <PageHeader
        title={
          invoice.invoice_number
        }
        description="Invoice Details"
      />

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link
            href={`/api/invoices/${invoice.id}/pdf`}
            target="_blank"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Link>
        </Button>

        {invoice.status ===
          "PAID" && (
          <Button
            variant="outline"
            asChild
          >
            <Link
              href={`/api/invoices/${invoice.id}/receipt`}
              target="_blank"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Invoice Information">
          <div className="space-y-3">
            <div>
              <strong>
                Invoice #:
              </strong>{" "}
              {
                invoice.invoice_number
              }
            </div>

            <div>
              <strong>
                Amount:
              </strong>{" "}
              $
              {Number(
                invoice.amount
              ).toFixed(2)}
            </div>

            <div>
              <strong>
                Status:
              </strong>{" "}
              {invoice.status}
            </div>

            <div>
              <strong>
                Issue Date:
              </strong>{" "}
              {invoice.issue_date ??
                "-"}
            </div>

            <div>
              <strong>
                Due Date:
              </strong>{" "}
              {invoice.due_date ??
                "-"}
            </div>

            <div>
              <strong>
                Notes:
              </strong>{" "}
              {invoice.notes ??
                "-"}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Client">
          <div className="space-y-3">
            <div>
              <strong>
                Name:
              </strong>{" "}
              {invoice.client
                ?.full_name ??
                "-"}
            </div>

            <div>
              <strong>
                Email:
              </strong>{" "}
              {invoice.client
                ?.email ?? "-"}
            </div>

            <div>
              <strong>
                Company:
              </strong>{" "}
              {invoice.client
                ?.company_name ??
                "-"}
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Project">
        <div className="space-y-3">
          <div>
            <strong>
              Project:
            </strong>{" "}
            {invoice.project
              ?.name ?? "-"}
          </div>

          <div>
            <strong>
              Status:
            </strong>{" "}
            {invoice.project
              ?.status ?? "-"}
          </div>

          <div>
            <strong>
              Progress:
            </strong>{" "}
            {invoice.project
              ?.progress ?? 0}
            %
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  );
}