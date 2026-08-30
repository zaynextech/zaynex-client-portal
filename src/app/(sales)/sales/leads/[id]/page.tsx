import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  User,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChangeLeadStatus } from "@/features/leads/components/change-lead-status";
import { AddLeadActivity } from "@/features/leads/components/add-lead-activity";
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
      return (
        <Badge variant="outline">
          {status ?? "Unknown"}
        </Badge>
      );
  }
}

export default async function LeadDetailsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .select(`
      id,
      name,
      company,
      email,
      phone,
      service,
      source,
      status,
      notes,
      assigned_to,
      created_at,
      updated_at
    `)
    .eq("id", id)
    .eq("assigned_to", user.id)
    .single();

  if (error || !lead) {
    notFound();
  }

  const { data: activities, error: activitiesError } = await supabase
    .from("lead_activities")
    .select(`
      id,
      lead_id,
      user_id,
      type,
      subject,
      notes,
      follow_up_at,
      created_at,
      updated_at
    `)
    .eq("lead_id", lead.id)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (activitiesError) {
    throw new Error(activitiesError.message);
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4"
          >
            <Link href="/sales/leads">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leads
            </Link>
          </Button>

          <PageHeader
            title={lead.name}
            description="Lead details and information"
          />
        </div>

        {/* Lead Overview */}
        <SectionCard title="Lead Information">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Name
                </p>

                <p className="font-medium">
                  {lead.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Company
                </p>

                <p className="font-medium">
                  {lead.company || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Email
                </p>

                {lead.email ? (
                  <a
                    href={`mailto:${lead.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {lead.email}
                  </a>
                ) : (
                  <p className="font-medium">
                    Not provided
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Phone
                </p>

                {lead.phone ? (
                  <a
                    href={`tel:${lead.phone}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {lead.phone}
                  </a>
                ) : (
                  <p className="font-medium">
                    Not provided
                  </p>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Status */}
        <SectionCard title="Lead Status">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Current status
              </p>

              <div className="mt-2">
                {getStatusBadge(lead.status)}
              </div>
            </div>

            <ChangeLeadStatus
              id={lead.id}
              currentStatus={lead.status}
            />
          </div>
        </SectionCard>

        {/* Activities */}
        <SectionCard title="Activities">
          <AddLeadActivity
            leadId={lead.id}
            activities={activities ?? []}
          />
        </SectionCard>

        {/* Additional Information */}
        <SectionCard title="Additional Information">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">
                Service
              </p>

              <p className="text-sm text-muted-foreground">
                {lead.service || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">
                Source
              </p>

              <p className="text-sm text-muted-foreground">
                {lead.source || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">
                Notes
              </p>

              <div className="mt-2 rounded-lg border p-4">
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {lead.notes || "No notes added."}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-wrap gap-3">
            {lead.email && (
              <Button asChild>
                <a href={`mailto:${lead.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email Lead
                </a>
              </Button>
            )}

            {lead.phone && (
              <Button variant="outline" asChild>
                <a href={`tel:${lead.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call Lead
                </a>
              </Button>
            )}

            <Button variant="outline" asChild>
              <Link href={`/sales/leads/${lead.id}/edit`}>
                Edit Lead
              </Link>
            </Button>

            <DeleteLeadButton id={lead.id} />
          </div>
          
        </div>
      </div>
    </PageContainer>
  );
}