import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Download,
  Receipt,
  Calendar,
  User,
  Mail,
  Building2,
  FolderKanban,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { getInvoice } from "@/features/invoices/actions/get-invoice";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function getStatusBadge(status: string) {
  const normalized = status?.toUpperCase();

  switch (normalized) {
    case "PAID":
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Paid
        </Badge>
      );
    case "PENDING":
    case "UNPAID":
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 font-semibold text-amber-600 dark:text-amber-400"
        >
          <Clock className="mr-1 h-3 w-3" />
          Pending Payment
        </Badge>
      );
    case "OVERDUE":
      return (
        <Badge
          variant="outline"
          className="border-rose-500/30 bg-rose-500/10 font-semibold text-rose-600 dark:text-rose-400"
        >
          <AlertCircle className="mr-1 h-3 w-3" />
          Overdue
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="font-semibold uppercase">
          {status}
        </Badge>
      );
  }
}

export default async function InvoicePage({ params }: PageProps) {
  const { id } = await params;

  const invoice = await getInvoice(id);

  if (!invoice) {
    notFound();
  }

  const formattedAmount = Number(invoice.amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const formattedIssueDate = invoice.issue_date
    ? new Date(invoice.issue_date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const formattedDueDate = invoice.due_date
    ? new Date(invoice.due_date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const projectProgress = invoice.project?.progress ?? 0;

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title={`Invoice ${invoice.invoice_number}`}
        description="Detailed breakdown of billing, client profile, and project progress."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" className="gap-1.5 font-medium shadow-xs">
              <Link href={`/api/invoices/${invoice.id}/pdf`} target="_blank">
                <Download className="h-4 w-4" />
                Download Invoice
              </Link>
            </Button>

            {invoice.status === "PAID" && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-1.5 font-medium border-emerald-500/30 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
              >
                <Link
                  href={`/api/invoices/${invoice.id}/receipt`}
                  target="_blank"
                >
                  <Receipt className="h-4 w-4" />
                  Download Receipt
                </Link>
              </Button>
            )}
          </div>
        }
      />

      {/* Hero Stat & Billing Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Invoice Primary Details */}
        <div className="lg:col-span-2">
          <SectionCard title="Invoice Information">
            <div className="space-y-6">
              {/* Highlight Amount Banner */}
              <div className="flex flex-col justify-between gap-4 rounded-xl border border-primary/20 bg-linear-to-br from-primary/5 via-primary/2 to-transparent p-5 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Total Amount Due
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                      {formattedAmount}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      USD
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(invoice.status)}
                </div>
              </div>

              {/* Dates & Reference Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Receipt className="h-3.5 w-3.5 text-primary" />
                    Invoice Number
                  </div>
                  <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                    {invoice.invoice_number}
                  </p>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Issue Date
                  </div>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formattedIssueDate}
                  </p>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    Due Date
                  </div>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formattedDueDate}
                  </p>
                </div>
              </div>

              {/* Notes / Terms */}
              {invoice.notes && (
                <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    Notes & Terms
                  </div>
                  <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-foreground/80">
                    {invoice.notes}
                  </p>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Client Profile Card */}
        <div className="lg:col-span-1">
          <SectionCard title="Client Details">
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Client Name
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {invoice.client?.full_name ?? "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Email Address
                  </p>
                  <p className="break-all text-sm font-semibold text-foreground">
                    {invoice.client?.email ?? "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Company
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {invoice.client?.company_name ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Associated Project */}
      <SectionCard title="Associated Project">
        {invoice.project ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FolderKanban className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-base font-semibold tracking-tight text-foreground">
                    {invoice.project.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Active linked project workspace
                  </p>
                </div>
              </div>

              {invoice.project.status && (
                <Badge
                  variant="outline"
                  className="font-medium uppercase tracking-wider text-xs"
                >
                  {invoice.project.status}
                </Badge>
              )}
            </div>

            {/* Project Progress */}
            <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-4">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-muted-foreground">
                  Project Completion
                </span>
                <span className="font-semibold tabular-nums text-foreground">
                  {projectProgress}%
                </span>
              </div>
              <Progress value={projectProgress} className="h-2" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
            <FolderKanban className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              No project linked to this invoice.
            </p>
          </div>
        )}
      </SectionCard>
    </PageContainer>
  );
}