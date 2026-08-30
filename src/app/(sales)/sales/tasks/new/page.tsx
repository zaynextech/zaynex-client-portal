import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createSalesTask } from "@/features/sales-tasks/actions/create-sales-task";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function NewSalesTaskPage() {
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
            <Link href="/sales/tasks">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Link>
          </Button>

          <PageHeader
            title="Add Task"
            description="Create a sales task or follow-up."
          />
        </div>

        <SectionCard title="Task Information">
          <form
            action={createSalesTask}
            className="space-y-5"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Task Title
              </label>

              <Input
                name="title"
                placeholder="Follow up with client"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description
              </label>

              <Textarea
                name="description"
                rows={4}
                placeholder="Add task details..."
                className="resize-none"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Priority
                </label>

                <select
                  name="priority"
                  defaultValue="MEDIUM"
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Due Date
                </label>

                <Input
                  name="due_date"
                  type="datetime-local"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                asChild
              >
                <Link href="/sales/tasks">
                  Cancel
                </Link>
              </Button>

              <Button type="submit">
                Create Task
              </Button>
            </div>
          </form>
        </SectionCard>
      </div>
    </PageContainer>
  );
}