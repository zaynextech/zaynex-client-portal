"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  DollarSign,
  Calendar,
  User,
  FolderKanban,
  FileText,
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

import { createInvoice } from "@/features/invoices/actions/create-invoice";

interface Client {
  id: string;
  full_name: string | null;
  email: string;
}

interface Project {
  id: string;
  name: string;
}

interface CreateInvoiceDialogProps {
  clients: Client[];
  projects: Project[];
}

export function CreateInvoiceDialog({
  clients,
  projects,
}: CreateInvoiceDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || !projectId) {
      toast.error("Please select both a client and a project.");
      return;
    }

    try {
      setLoading(true);

      await createInvoice({
        project_id: projectId,
        client_id: clientId,
        amount: Number(amount),
        due_date: dueDate,
        notes,
      });

      toast.success("Invoice created successfully");
      setOpen(false);

      // Reset form state
      setProjectId("");
      setClientId("");
      setAmount("");
      setDueDate("");
      setNotes("");

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-medium shadow-xs">
          <Plus className="h-4 w-4" />
          New Invoice
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl border-border/80 bg-card text-card-foreground shadow-lg">
        <DialogHeader className="space-y-1 pb-2">
          <DialogTitle className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            Create New Invoice
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
            Fill in the billing details below to generate and assign an invoice.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Client & Project Selectors */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Client Dropdown */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Client <span className="text-destructive">*</span>
              </label>
              <select
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-input dark:bg-background dark:text-foreground"
              >
                <option value="" className="bg-background text-muted-foreground">
                  Select Client
                </option>
                {clients.map((client) => (
                  <option
                    key={client.id}
                    value={client.id}
                    className="bg-background text-foreground"
                  >
                    {client.full_name
                      ? `${client.full_name} (${client.email})`
                      : client.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Dropdown */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <FolderKanban className="h-3.5 w-3.5 text-muted-foreground" />
                Project <span className="text-destructive">*</span>
              </label>
              <select
                required
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-input dark:bg-background dark:text-foreground"
              >
                <option value="" className="bg-background text-muted-foreground">
                  Select Project
                </option>
                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                    className="bg-background text-foreground"
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount & Due Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Amount (USD) <span className="text-destructive">*</span>
              </label>
              <Input
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Due Date <span className="text-destructive">*</span>
              </label>
              <Input
                required
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-background text-foreground dark:scheme-dark"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Notes / Payment Instructions
            </label>
            <Textarea
              placeholder="e.g., Bank transfer details, project milestones, or terms..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="min-h-20 resize-y bg-background text-foreground"
            />
          </div>

          {/* Submit Action */}
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
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}