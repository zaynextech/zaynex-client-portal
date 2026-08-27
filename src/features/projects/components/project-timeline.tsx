"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Trash2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { updateTimelineStatus } from "@/features/projects/actions/update-timeline-status";
import { deleteTimelineEntry } from "@/features/projects/actions/delete-timeline-entry";

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

export function ProjectTimeline({ items, projectId }: ProjectTimelineProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleStatusChange(timelineId: string, status: string) {
    try {
      setLoadingId(timelineId);
      await updateTimelineStatus(timelineId, projectId, status);
      toast.success("Status updated successfully.");
      router.refresh();
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(timelineId: string) {
    try {
      setLoadingId(timelineId);
      await deleteTimelineEntry(timelineId, projectId);
      toast.success("Timeline entry deleted.");
      router.refresh();
    } catch {
      toast.error("Failed to delete timeline entry.");
    } finally {
      setLoadingId(null);
    }
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
        <Clock className="h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          No timeline entries recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const formattedDate = new Date(item.created_at).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        );

        return (
          <Card
            key={item.id}
            className="border-border/60 bg-card text-card-foreground shadow-xs transition-colors hover:border-border"
          >
            <CardContent className="p-4 sm:p-5">
              <div className="space-y-3">
                {/* Header: Title, Status Selector & Delete Button */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    <h4 className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {/* Dark/Light Mode Visible Select */}
                    <select
                      value={item.status}
                      disabled={loadingId === item.id}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                      className="h-8 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-input dark:bg-background dark:text-foreground"
                    >
                      <option
                        value="PENDING"
                        className="bg-background text-foreground"
                      >
                        Pending
                      </option>
                      <option
                        value="IN_PROGRESS"
                        className="bg-background text-foreground"
                      >
                        In Progress
                      </option>
                      <option
                        value="COMPLETED"
                        className="bg-background text-foreground"
                      >
                        Completed
                      </option>
                    </select>

                    {/* Delete Alert Dialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          disabled={loadingId === item.id}
                          aria-label="Delete milestone"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="border-border/80 bg-card text-card-foreground">
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete timeline entry?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground">
                            This action cannot be undone. This timeline milestone
                            will be permanently removed from the project.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-border">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id)}
                            disabled={loadingId === item.id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {loadingId === item.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-foreground/85">
                    {item.description}
                  </p>
                )}

                {/* Hydration-safe Timestamp */}
                <div className="flex items-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span suppressHydrationWarning>{formattedDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}