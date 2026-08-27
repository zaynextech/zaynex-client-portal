"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Clock,
  FileText,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { addTimelineEntry } from "@/features/projects/actions/add-timeline-entry";

interface AddTimelineDialogProps {
  projectId: string;
}

export function AddTimelineDialog({ projectId }: AddTimelineDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error("Please enter a title for the timeline entry.");
      return;
    }

    try {
      setLoading(true);

      await addTimelineEntry({
        project_id: projectId,
        title: trimmedTitle,
        description: description.trim(),
        status,
      });

      toast.success("Timeline entry added successfully");

      setOpen(false);
      setTitle("");
      setDescription("");
      setStatus("PENDING");

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add timeline entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 font-medium shadow-xs">
          <Plus className="h-4 w-4" />
          Add Timeline Entry
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg border-border/80 bg-card text-card-foreground shadow-lg">
        <DialogHeader className="space-y-1 pb-2">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Add Timeline Milestone
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
            Record a milestone, phase update, or key event for this project.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Milestone Title */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              Milestone Title <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g. Design Phase Approved, MVP Deployed"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
              className="bg-background"
            />
          </div>

          {/* Status Dropdown */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              Status <span className="text-destructive">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
              className="h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-input dark:bg-background dark:text-foreground"
            >
              <option value="PENDING" className="bg-background text-foreground">
                Pending
              </option>
              <option value="IN_PROGRESS" className="bg-background text-foreground">
                In Progress
              </option>
              <option value="COMPLETED" className="bg-background text-foreground">
                Completed
              </option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Description & Notes
            </label>
            <Textarea
              placeholder="Add key deliverables, updates, or notes (Markdown formatting supported)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={4}
              className="min-h-24 resize-y bg-background text-foreground leading-relaxed"
            />
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="w-full sm:w-auto"
            >
              {loading ? "Adding..." : "Add Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}