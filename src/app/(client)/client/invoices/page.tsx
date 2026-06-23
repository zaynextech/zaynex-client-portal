import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { createClient } from "@/lib/supabase/server";

export default async function ClientInvoicesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: invoices } =
    await supabase
      .from("invoices")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", {
        ascending: false,
      });

  return (
    <PageContainer>
      <PageHeader
        title="My Invoices"
        description="View your invoices"
      />

      <div className="space-y-4">
        {invoices?.length ? (
          invoices.map((invoice) => (
            <SectionCard
              key={invoice.id}
              title={
                invoice.invoice_number
              }
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <p>
                    <strong>
                      Amount:
                    </strong>{" "}
                    ${invoice.amount}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {invoice.status}
                  </p>

                  <p>
                    <strong>
                      Due Date:
                    </strong>{" "}
                    {invoice.due_date ??
                      "-"}
                  </p>
                </div>

                <Link
                  href={`/client/invoices/${invoice.id}`}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  View Invoice
                </Link>
              </div>
            </SectionCard>
          ))
        ) : (
          <SectionCard title="Invoices">
            <p className="text-muted-foreground">
              No invoices found.
            </p>
          </SectionCard>
        )}
      </div>
    </PageContainer>
  );
}