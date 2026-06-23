"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { updateTimelineStatus } from "@/features/projects/actions/update-timeline-status";

interface TimelineItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
}

interface ProjectTimelineProps {
  items: TimelineItem[];
  projectId: string;
}

export function ProjectTimeline({
  items,
  projectId,
}: ProjectTimelineProps) {
  const router = useRouter();

  async function handleStatusChange(
    timelineId: string,
    status: string
  ) {
    try {
      await updateTimelineStatus(
        timelineId,
        projectId,
        status
      );

      toast.success(
        "Status updated"
      );

      router.refresh();
    } catch {
      toast.error(
        "Failed to update status"
      );
    }
  }

  if (!items.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No timeline entries yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  {item.title}
                </h4>

                <select
                  value={item.status}
                  onChange={(e) =>
                    handleStatusChange(
                      item.id,
                      e.target.value
                    )
                  }
                  className="rounded-md border px-2 py-1 text-xs"
                >
                  <option value="PENDING">
                    Pending
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>
                </select>
              </div>

              {item.description && (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                {new Date(item.created_at)
                  .toISOString()
                  .split("T")[0]}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}