import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { updateLead } from "@/features/leads/actions/update-lead";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
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
      website,
      source,
      service,
      status,
      notes
    `)
    .eq("id", id)
    .eq("assigned_to", user.id)
    .single();

  if (error || !lead) {
    notFound();
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
            <Link href={`/sales/leads/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lead
            </Link>
          </Button>

          <PageHeader
            title="Edit Lead"
            description="Update lead information and sales details."
          />
        </div>

        <SectionCard title="Lead Information">
          <form action={updateLead} className="space-y-5">

            {/* Lead ID */}
            <input type="hidden" name="id" value={lead.id} />

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>

              <Input
                name="name"
                defaultValue={lead.name ?? ""}
                placeholder="John Doe"
                required
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Company
              </label>

              <Input
                name="company"
                defaultValue={lead.company ?? ""}
                placeholder="ABC Company"
              />
            </div>

            {/* Email + Phone */}
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Email
                </label>

                <Input
                  name="email"
                  type="email"
                  defaultValue={lead.email ?? ""}
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Phone
                </label>

                <Input
                  name="phone"
                  type="tel"
                  defaultValue={lead.phone ?? ""}
                  placeholder="+211..."
                />
              </div>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Website
              </label>

              <Input
                name="website"
                type="url"
                defaultValue={lead.website ?? ""}
                placeholder="https://example.com"
              />
            </div>

            {/* Source + Status */}
            <div className="grid gap-5 md:grid-cols-2">

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Source
                </label>

                <select
                  name="source"
                  defaultValue={lead.source ?? ""}
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select source</option>
                  <option value="WEBSITE">Website</option>
                  <option value="FACEBOOK">Facebook</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="COLD_OUTREACH">Cold Outreach</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Status
                </label>

                <select
                  name="status"
                  defaultValue={lead.status ?? "NEW"}
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>

            </div>

            {/* Service */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Interested Service
              </label>

              <select
                name="service"
                defaultValue={lead.service ?? ""}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">Select service</option>
                <option value="WEBSITE">Website</option>
                <option value="WEB_APP">Web Application</option>
                <option value="ECOMMERCE">E-commerce</option>
                <option value="MOBILE_APP">Mobile App</option>
                <option value="LMS">LMS</option>
                <option value="SEO">SEO</option>
                <option value="UI_UX">UI/UX Design</option>
                <option value="BRANDING">Branding</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Notes
              </label>

              <Textarea
                name="notes"
                rows={5}
                defaultValue={lead.notes ?? ""}
                placeholder="Add notes about this lead..."
                className="resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                asChild
              >
                <Link href={`/sales/leads/${id}`}>
                  Cancel
                </Link>
              </Button>

              <Button type="submit">
                Save Changes
              </Button>
            </div>

          </form>
        </SectionCard>
      </div>
    </PageContainer>
  );
}