"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { toast } from "sonner";

import { updateTimelineStatus } from "@/features/projects/actions/update-timeline-status";

interface TimelineItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
}

interface DeveloperTimelineProps {
  items: TimelineItem[];
  projectId: string;
}

export function DeveloperTimeline({
  items,
  projectId,
}: DeveloperTimelineProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function toggleMilestone(item: TimelineItem) {
    try {
      setLoadingId(item.id);

      const newStatus =
        item.status === "COMPLETED"
          ? "PENDING"
          : "COMPLETED";

      await updateTimelineStatus(
        item.id,
        projectId,
        newStatus
      );

      toast.success(
        newStatus === "COMPLETED"
          ? "Milestone completed."
          : "Milestone marked as pending."
      );

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update milestone."
      );
    } finally {
      setLoadingId(null);
    }
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No milestones have been added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const completed = item.status === "COMPLETED";
        const inProgress = item.status === "IN_PROGRESS";

        return (
          <button
            key={item.id}
            type="button"
            disabled={loadingId === item.id}
            onClick={() => toggleMilestone(item)}
            className="flex w-full items-start gap-3 rounded-xl border p-4 text-left transition hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <div className="pt-0.5">
              {completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : inProgress ? (
                <Clock className="h-5 w-5 text-blue-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3
                  className={`font-medium ${
                    completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {item.title}
                </h3>

                <span className="shrink-0 text-xs text-muted-foreground">
                  {completed
                    ? "Completed"
                    : inProgress
                      ? "In Progress"
                      : "Pending"}
                </span>
              </div>

              {item.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}