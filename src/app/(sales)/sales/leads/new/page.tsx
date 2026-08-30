import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createLead } from "@/features/leads/actions/create-lead";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function NewLeadPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Add Lead"
          description="Create a new sales lead and start tracking the opportunity."
        />

        <SectionCard title="Lead Information">
          <form action={createLead} className="space-y-5">

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
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
                  defaultValue=""
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
                  defaultValue="NEW"
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
                defaultValue=""
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
                <Link href="/sales/leads">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Link>
              </Button>

              <Button type="submit">
                Create Lead
              </Button>
            </div>

          </form>
        </SectionCard>
      </div>
    </PageContainer>
  );
}