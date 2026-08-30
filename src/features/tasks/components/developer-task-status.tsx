"use client";

import { useTransition } from "react";
import { Loader2, CheckCircle2, Clock, Circle } from "lucide-react";
import { toast } from "sonner";

import { updateTaskStatus } from "@/features/tasks/actions/update-task-status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Status = "TODO" | "IN_PROGRESS" | "COMPLETED";

interface DeveloperTaskStatusProps {
  taskId: string;
  status: Status | string;
}

export function DeveloperTaskStatus({
  taskId,
  status,
}: DeveloperTaskStatusProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === status || isPending) return;

    startTransition(async () => {
      try {
        await updateTaskStatus(taskId, newStatus as Status);
        toast.success("Task status updated");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update task"
        );
      }
    });
  };
 
  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full min-w-0">
      <Select
        value={status}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="h-8 w-full border-border/80 bg-background/90 px-2.5 text-xs font-semibold shadow-xs transition-colors hover:bg-background">
          {isPending ? (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span>Updating...</span>
            </div>
          ) : (
            <SelectValue placeholder="Select status" />
          )}
        </SelectTrigger>

        <SelectContent align="end" className="w-40">
          <SelectItem value="TODO" className="text-xs font-medium cursor-pointer">
            <div className="flex items-center gap-2">
              <Circle className="h-3.5 w-3.5 text-muted-foreground" />
              <span>To Do</span>
            </div>
          </SelectItem>

          <SelectItem value="IN_PROGRESS" className="text-xs font-medium cursor-pointer">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                In Progress
              </span>
            </div>
          </SelectItem>

          <SelectItem value="COMPLETED" className="text-xs font-medium cursor-pointer">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Completed
              </span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}