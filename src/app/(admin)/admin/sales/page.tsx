import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { MarkCommissionPaidButton } from "@/features/commissions/components/mark-commission-paid-button";
import { EditCommissionDialog } from "@/features/commissions/components/edit-commission-dialog";

export default async function AdminSalesPage() {
  const supabase = await createClient();

  // Get all projects that have a salesperson
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      budget,
      commission_rate,
      salesperson_id,
      salesperson:profiles!projects_salesperson_id_fkey(
        id,
        full_name,
        email
      )
    `)
    .not("salesperson_id", "is", null)
    .order("created_at", { ascending: false });

  if (projectsError) {
    console.error(
      "GET SALES PROJECTS ERROR:",
      JSON.stringify(projectsError, null, 2)
    );
  }

  // Get commission records
  const { data: commissions, error: commissionsError } = await supabase
    .from("commissions")
    .select(`
      id,
      project_id,
      amount,
      rate,
      status,
      paid_at
    `);

  if (commissionsError) {
    console.error(
      "GET COMMISSIONS ERROR:",
      JSON.stringify(commissionsError, null, 2)
    );
  }

  const commissionRows = commissions ?? [];

  // Build sales records
  const rows = (projects ?? []).map((project) => {
    const salesperson = Array.isArray(project.salesperson)
      ? project.salesperson[0]
      : project.salesperson;

    const budget = Number(project.budget ?? 0);
    const rate = Number(project.commission_rate ?? 0);

    const calculatedAmount = Number(
      ((budget * rate) / 100).toFixed(2)
    );

    // IMPORTANT:
    // Match commission using project_id
    const commission = commissionRows.find(
      (item) => String(item.project_id) === String(project.id)
    );

    return {
      projectId: project.id,
      projectName: project.name,
      budget,
      rate,

      amount: commission
        ? Number(commission.amount ?? calculatedAmount)
        : calculatedAmount,

      status: commission?.status ?? "PENDING",

      paidAt: commission?.paid_at ?? null,

      commissionId: commission?.id ?? null,

      salesperson,
    };
  });

  const totalCommission = rows.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const pendingCommission = rows
    .filter((item) => item.status === "PENDING")
    .reduce((sum, item) => sum + item.amount, 0);

  const paidCommission = rows
    .filter((item) => item.status === "PAID")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Sales & Commissions"
          description="Manage salesperson commissions and payments."
        />

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <SectionCard title="Total Commission">
            <p className="text-2xl font-bold">
              ${totalCommission.toLocaleString()}
            </p>
          </SectionCard>

          <SectionCard title="Pending">
            <p className="text-2xl font-bold">
              ${pendingCommission.toLocaleString()}
            </p>
          </SectionCard>

          <SectionCard title="Paid">
            <p className="text-2xl font-bold">
              ${paidCommission.toLocaleString()}
            </p>
          </SectionCard>
        </div>

        {/* Records */}
        <SectionCard
          title={`Commission Records (${rows.length})`}
        >
          <div className="space-y-3">
            {rows.map((row) => {
              const isPaid = row.status === "PAID";

              const hasCommissionId =
                typeof row.commissionId === "string" &&
                row.commissionId.trim().length > 0;

              return (
                <div
                  key={row.projectId}
                  className="rounded-xl border border-border/60 bg-muted/10 p-4"
                >
                  {/* Main */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Salesperson + Project */}
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {row.salesperson?.full_name ||
                          row.salesperson?.email ||
                          "Unknown salesperson"}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Project:{" "}
                        <span className="font-medium text-foreground">
                          {row.projectName}
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Budget:{" "}
                        <span className="font-medium text-foreground">
                          ${row.budget.toLocaleString()}
                        </span>
                      </p>
                    </div>

                    {/* Commission */}
                    <div className="text-left md:text-right">
                      <p className="text-lg font-bold">
                        ${row.amount.toLocaleString()}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {row.rate}% commission
                      </p>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* Status */}
                    <div className="text-xs text-muted-foreground">
                      Status:{" "}
                      <span
                        className={
                          isPaid
                            ? "font-semibold text-emerald-600 dark:text-emerald-400"
                            : "font-semibold text-amber-600 dark:text-amber-400"
                        }
                      >
                        {row.status}
                      </span>

                      {row.paidAt && (
                        <>
                          {" · "}Paid{" "}
                          {new Date(row.paidAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {hasCommissionId ? (
                        <>
                          <EditCommissionDialog
                            commission={{
                              id: row.commissionId as string,
                              amount: row.amount,
                              rate: row.rate,
                              status: row.status,
                              paid_at: row.paidAt,
                            }}
                          />

                          {!isPaid && (
                            <MarkCommissionPaidButton
                              commissionId={
                                row.commissionId as string
                              }
                            />
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Commission not created
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {rows.length === 0 && (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <p className="font-medium">
                  No salesperson projects yet.
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Assign a salesperson to a project to see
                  the commission here.
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}