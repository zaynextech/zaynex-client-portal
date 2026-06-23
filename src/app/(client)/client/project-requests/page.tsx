import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProjectRequestInClient } from "@/features/project-requests/create-project-request-in-client";

export default function StartProjectPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Start a New Project"
        description="Tell us about your project and we'll review your request."
      />

      <form
        action={createProjectRequestInClient}
        className="mx-auto max-w-3xl space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Company Name *
            </label>

            <Input
              name="company_name"
              placeholder="ABC Company"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Contact Email *
            </label>

            <Input
              name="email"
              type="email"
              placeholder="john@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone Number
          </label>

          <Input
            name="phone"
            placeholder="+211..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Project Name *
          </label>

          <Input
            name="project_name"
            placeholder="Company Website"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Project Type *
          </label>

          <select
            name="project_type"
            required
            className="flex h-10 w-full rounded-md border bg-background px-3"
          >
            <option value="">
              Select Project Type
            </option>

            <option value="Business Website">
              Business Website
            </option>

            <option value="Online Store">
              Online Store
            </option>

            <option value="Web Application">
              Web Application
            </option>

            <option value="Client Portal">
              Client Portal
            </option>

            <option value="School System">
              School System
            </option>

            <option value="Mobile App">
              Mobile App
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Budget Range (Optional)
          </label>

          <select
            name="budget_range"
            className="flex h-10 w-full rounded-md border bg-background px-3"
          >
            <option value="">
              Not Sure Yet
            </option>

            <option value="Under $500">
              Under $500
            </option>

            <option value="$500 - $1,000">
              $500 - $1,000
            </option>

            <option value="$1,000 - $3,000">
              $1,000 - $3,000
            </option>

            <option value="$3,000+">
              $3,000+
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Target Launch Date
          </label>

          <Input
            name="target_launch_date"
            type="date"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Project Description *
          </label>

          <Textarea
            name="description"
            rows={8}
            required
            placeholder="Describe your project, goals, and required features..."
          />
        </div>

        <Button
          type="submit"
          className="w-full"
        >
          Submit Project Request
        </Button>
      </form>
    </PageContainer>
  );
}