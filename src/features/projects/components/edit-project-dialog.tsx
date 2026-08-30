"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FolderKanban,
  FileText,
  Tag,
  Percent,
  DollarSign,
  Calendar,
  Pencil,
  UserRound,
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

import { updateProject } from "@/features/projects/actions/update-project";

const PROJECT_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface Salesperson {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface EditProjectDialogProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    progress: number | null;
    budget: number | null;
    commission_rate: number | null;
    start_date: string | null;
    due_date: string | null;
    salesperson_id: string | null;
  };
  salespeople: Salesperson[];
}

export function EditProjectDialog({
  project,
  salespeople,
}: EditProjectDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description ?? "");
  const [status, setStatus] = useState(project.status ?? "PENDING");
  const [progress, setProgress] = useState(project.progress ?? 0);
  const [budget, setBudget] = useState(project.budget ?? 0);
  const [commissionRate, setCommissionRate] = useState(
    project.commission_rate ?? 0
  );

  const [salespersonId, setSalespersonId] = useState(
    project.salesperson_id ?? ""
  );

  const [startDate, setStartDate] = useState(
    project.start_date?.split("T")[0] ?? ""
  );

  const [dueDate, setDueDate] = useState(
    project.due_date?.split("T")[0] ?? ""
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Project name cannot be empty.");
      return;
    }

    startTransition(async () => {
      try {
        await updateProject({
          id: project.id,
          name: name.trim(),
          description: description.trim() || null,
          status,
          progress: Number(progress),
          budget: Number(budget),
          commission_rate: Number(commissionRate),
          start_date: startDate || null,
          due_date: dueDate || null,
          salesperson_id: salespersonId || null,
        });

        toast.success("Project updated successfully");
        setOpen(false);
        router.refresh();
      } catch (error) {
        console.error(error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update project"
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 font-medium shadow-xs"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit Project
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border-border/80 bg-card p-6 text-card-foreground shadow-2xl sm:p-8">
        <DialogHeader className="space-y-1.5 border-b border-border/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderKanban className="h-5 w-5" />
            </div>

            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Edit Project Details
              </DialogTitle>

              <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
                Update project information, salesperson, timeline, and budget.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-5 pt-4">
          {/* Project Name & Salesperson */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                Project Name <span className="text-destructive">*</span>
              </label>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={pending}
                required
                placeholder="e.g. Acme Redesign & Branding"
                className="bg-background text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <UserRound className="h-3.5 w-3.5 text-muted-foreground" />
                Salesperson
              </label>

              <select
                value={salespersonId}
                onChange={(e) => setSalespersonId(e.target.value)}
                disabled={pending}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">No salesperson assigned</option>

                {salespeople.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.full_name?.trim() || person.email || "Unnamed Seller"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status, Progress, Budget & Commission Rate */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={pending}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {PROJECT_STATUSES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold">
                <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                Progress ({progress}%)
              </label>

              <Input
                type="number"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Budget ($ USD)
              </label>

              <Input
                type="number"
                min={0}
                step="0.01"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold">
                <Percent className="h-3.5 w-3.5 text-muted-foreground" />
                Commission (%)
              </label>

              <Input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                disabled={pending}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Start Date
              </label>

              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={pending}
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Due Date
              </label>

              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={pending}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Project Description
            </label>

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={pending}
              rows={4}
              placeholder="Outline project scope, deliverables, and technical notes..."
              className="resize-y bg-background text-foreground"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 border-t border-border/40 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={pending}
              className="w-full sm:w-auto"
            >
              {pending ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}