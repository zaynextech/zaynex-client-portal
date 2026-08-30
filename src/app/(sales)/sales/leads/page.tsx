import Link from "next/link";
import {
  Plus,
  Users,
  UserPlus,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Pencil,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteLeadButton } from "@/features/leads/components/delete-lead-button";

function getStatusBadge(status: string | null) {
  switch (status?.toUpperCase()) {
    case "NEW":
      return (
        <Badge variant="outline" className="text-blue-600">
          New
        </Badge>
      );

    case "CONTACTED":
      return (
        <Badge variant="outline" className="text-amber-600">
          Contacted
        </Badge>
      );

    case "QUALIFIED":
      return (
        <Badge variant="outline" className="text-purple-600">
          Qualified
        </Badge>
      );

    case "CONVERTED":
      return (
        <Badge variant="outline" className="text-emerald-600">
          Converted
        </Badge>
      );

    case "LOST":
      return (
        <Badge variant="outline" className="text-red-600">
          Lost
        </Badge>
      );

    default:
      return <Badge variant="outline">{status ?? "Unknown"}</Badge>;
  }
}

export default async function SalesLeadsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: leads, error } = await supabase
    .from("leads")
    .select(`
      id,
      name,
      company,
      email,
      phone,
      status,
      created_at
    `)
    .eq("assigned_to", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const leadList = leads ?? [];

  const total = leadList.length;
  const newLeads = leadList.filter(
    (lead) => lead.status?.toUpperCase() === "NEW"
  ).length;

  const contacted = leadList.filter(
    (lead) => lead.status?.toUpperCase() === "CONTACTED"
  ).length;

  const converted = leadList.filter(
    (lead) => lead.status?.toUpperCase() === "CONVERTED"
  ).length;

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Sales Leads"
          description="Manage your leads, follow up with prospects, and convert opportunities."
          action={
            <Button asChild>
              <Link href="/sales/leads/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Lead
              </Link>
            </Button>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Total Leads
              </span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold">{total}</p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                New
              </span>
              <UserPlus className="h-4 w-4 text-blue-500" />
            </div>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              {newLeads}
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Contacted
              </span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>

            <p className="mt-2 text-2xl font-bold text-amber-600">
              {contacted}
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Converted
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>

            <p className="mt-2 text-2xl font-bold text-emerald-600">
              {converted}
            </p>
          </div>
        </div>

        {/* Leads */}
        {leadList.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <Users className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-4 font-semibold">No leads yet</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Add your first sales lead to start tracking prospects.
            </p>

            <Button asChild className="mt-5">
              <Link href="/sales/leads/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Lead
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {leadList.map((lead) => (
              <div
                key={lead.id}
                className="group relative flex flex-col gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold group-hover:text-primary">
                      <Link
                        href={`/sales/leads/${lead.id}`}
                        className="focus:outline-none"
                      >
                        <span
                          className="absolute inset-0"
                          aria-hidden="true"
                        />
                        {lead.name}
                      </Link>
                    </h2>

                    <div className="relative z-10">
                      {getStatusBadge(lead.status)}
                    </div>
                  </div>

                  {lead.company && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {lead.company}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {lead.email && (
                      <span className="relative z-10">{lead.email}</span>
                    )}http://localhost:3000/sales/leads/010c8df0-a7f2-4f95-90ee-99ddc5301298
                    {lead.phone && (
                      <span className="relative z-10">{lead.phone}</span>
                    )}
                  </div>
                </div>

                <div className="relative z-10 flex shrink-0 items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/sales/leads/${lead.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>

                  <DeleteLeadButton id={lead.id} />

                  <ArrowUpRight className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}