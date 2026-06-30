"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
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

export function ProjectTimeline({
  items,
  projectId,
}: ProjectTimelineProps) {
  const router = useRouter();

  const [loadingId, setLoadingId] =
    useState<string | null>(null);

  async function handleStatusChange(
    timelineId: string,
    status: string
  ) {
    try {
      setLoadingId(timelineId);

      await updateTimelineStatus(
        timelineId,
        projectId,
        status
      );

      toast.success(
        "Status updated successfully."
      );

      router.refresh();
    } catch {
      toast.error(
        "Failed to update status."
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(
    timelineId: string
  ) {
    try {
      setLoadingId(timelineId);

      await deleteTimelineEntry(
        timelineId,
        projectId
      );

      toast.success(
        "Timeline entry deleted."
      );

      router.refresh();
    } catch {
      toast.error(
        "Failed to delete timeline entry."
      );
    } finally {
      setLoadingId(null);
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
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <h4 className="font-medium">
                  {item.title}
                </h4>

                <div className="flex items-center gap-2">
                  <select
                    value={item.status}
                    disabled={
                      loadingId === item.id
                    }
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

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={
                          loadingId === item.id
                        }
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete timeline entry?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          This action cannot be
                          undone. This timeline
                          entry will be permanently
                          removed from the project.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                          onClick={() =>
                            handleDelete(item.id)
                          }
                          disabled={
                            loadingId === item.id
                          }
                        >
                          {loadingId === item.id
                            ? "Deleting..."
                            : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {item.description && (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                {new Date(
                  item.created_at
                ).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}