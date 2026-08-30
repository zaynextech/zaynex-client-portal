import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { DownloadCommissionInvoiceButton } from "@/features/commissions/components/download-commission-invoice-button";

export default async function SalesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get salesperson's profile details
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const salespersonName =
    profile?.full_name || user.email || "Salesperson";

  // Get salesperson's projects
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      budget,
      commission_rate,
      status,
      progress,
      start_date,
      due_date,
      created_at,
      client:profiles!projects_client_id_fkey(
        full_name,
        email
      )
    `)
    .eq("salesperson_id", user.id)
    .order("created_at", { ascending: false });

  if (projectsError) {
    console.error(
      "GET SALES PROJECTS ERROR:",
      JSON.stringify(projectsError, null, 2)
    );
  }

  // Get actual commission records for this salesperson
  const projectIds = (projects ?? []).map((project) => project.id);

  const { data: commissions, error: commissionsError } =
    projectIds.length > 0
      ? await supabase
          .from("commissions")
          .select(`
            id,
            project_id,
            amount,
            rate,
            status,
            paid_at
          `)
          .in("project_id", projectIds)
      : { data: [], error: null };

  if (commissionsError) {
    console.error(
      "GET SALES COMMISSIONS ERROR:",
      JSON.stringify(commissionsError, null, 2)
    );
  }

  const commissionRows = commissions ?? [];

  // Match each project with its commission
  const rows = (projects ?? []).map((project) => {
    const budget = Number(project.budget ?? 0);
    const rate = Number(project.commission_rate ?? 0);

    const calculatedCommission = Number(
      ((budget * rate) / 100).toFixed(2)
    );

    const commission = commissionRows.find(
      (item) => String(item.project_id) === String(project.id)
    );

    return {
      ...project,
      budget,
      rate,
      commissionAmount: commission
        ? Number(commission.amount ?? calculatedCommission)
        : calculatedCommission,
      commissionStatus: commission?.status ?? "PENDING",
      commissionPaidAt: commission?.paid_at ?? null,
      commissionId: commission?.id ?? null,
    };
  });

  // Sales totals
  const totalSales = rows.reduce(
    (sum, project) => sum + project.budget,
    0
  );

  // Commission totals
  const totalCommission = rows.reduce(
    (sum, project) => sum + project.commissionAmount,
    0
  );

  const pendingCommission = rows
    .filter((project) => project.commissionStatus === "PENDING")
    .reduce((sum, project) => sum + project.commissionAmount, 0);

  const paidCommission = rows
    .filter((project) => project.commissionStatus === "PAID")
    .reduce((sum, project) => sum + project.commissionAmount, 0);

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Sales Dashboard"
          description="Track your projects, progress, deadlines, sales, and commissions."
        />

        {/* Summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SectionCard title="Total Sales">
            <p className="text-2xl font-bold">
              ${totalSales.toLocaleString()}
            </p>
          </SectionCard>

          <SectionCard title="Total Commission">
            <p className="text-2xl font-bold">
              ${totalCommission.toLocaleString()}
            </p>
          </SectionCard>

          <SectionCard title="Pending">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              ${pendingCommission.toLocaleString()}
            </p>
          </SectionCard>

          <SectionCard title="Paid">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${paidCommission.toLocaleString()}
            </p>
          </SectionCard>
        </div>

        {/* Projects */}
        <SectionCard
          title={`My Projects (${rows.length})`}
        >
          <div className="space-y-4">
            {rows.map((project) => {
              const progress = Math.min(
                Math.max(Number(project.progress ?? 0), 0),
                100
              );

              const client = Array.isArray(project.client)
                ? project.client[0]
                : project.client;

              const dueDate = project.due_date
                ? new Date(project.due_date)
                : null;

              const today = new Date();

              const daysRemaining = dueDate
                ? Math.ceil(
                    (dueDate.getTime() - today.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : null;

              const isPaid =
                project.commissionStatus === "PAID";

              return (
                <div
                  key={project.id}
                  className="rounded-xl border border-border/60 bg-muted/10 p-4"
                >
                  {/* Project Header with Invoice Button */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-foreground">
                        {project.name}
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        Client:{" "}
                        <span className="font-medium text-foreground">
                          {client?.full_name ??
                            client?.email ??
                            "—"}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                      <span className="w-fit rounded-full border px-2.5 py-1 text-xs font-medium">
                        {project.status}
                      </span>

                      <DownloadCommissionInvoiceButton
                        commission={{
                          id: project.commissionId ?? project.id,
                          projectName: project.name,
                          salespersonName,
                          budget: project.budget,
                          rate: project.rate,
                          amount: project.commissionAmount,
                          status: project.commissionStatus,
                          paidAt: project.commissionPaidAt,
                        }}
                      />
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Project Progress
                      </span>

                      <span className="font-semibold">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Important Information */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Project Value */}
                    <div className="rounded-lg border bg-background p-3">
                      <p className="text-xs text-muted-foreground">
                        Project Value
                      </p>

                      <p className="mt-1 font-semibold">
                        ${project.budget.toLocaleString()}
                      </p>
                    </div>

                    {/* Commission */}
                    <div className="rounded-lg border bg-background p-3">
                      <p className="text-xs text-muted-foreground">
                        Commission
                      </p>

                      <p className="mt-1 font-semibold">
                        {project.rate}% · $
                        {project.commissionAmount.toLocaleString()}
                      </p>

                      <p
                        className={
                          isPaid
                            ? "mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                            : "mt-1 text-xs font-semibold text-amber-600 dark:text-amber-400"
                        }
                      >
                        {project.commissionStatus}
                      </p>

                      {project.commissionPaidAt && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Paid{" "}
                          {new Date(
                            project.commissionPaidAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>

                    {/* Start Date */}
                    <div className="rounded-lg border bg-background p-3">
                      <p className="text-xs text-muted-foreground">
                        Start Date
                      </p>

                      <p className="mt-1 font-semibold">
                        {project.start_date
                          ? new Date(
                              project.start_date
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Not set"}
                      </p>
                    </div>

                    {/* Deadline */}
                    <div className="rounded-lg border bg-background p-3">
                      <p className="text-xs text-muted-foreground">
                        Deadline
                      </p>

                      <p className="mt-1 font-semibold">
                        {dueDate
                          ? dueDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Not set"}
                      </p>

                      {daysRemaining !== null && (
                        <p
                          className={`mt-1 text-xs ${
                            daysRemaining < 0
                              ? "text-destructive"
                              : daysRemaining <= 3
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-muted-foreground"
                          }`}
                        >
                          {daysRemaining < 0
                            ? `${Math.abs(daysRemaining)} days overdue`
                            : daysRemaining === 0
                              ? "Due today"
                              : `${daysRemaining} days remaining`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {!rows.length && (
              <div className="rounded-xl border border-dashed p-8 text-center">
                <p className="font-medium">
                  No projects assigned
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Projects assigned to you will appear here.
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}