"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
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

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [projectId, setProjectId] =
    useState("");

  const [clientId, setClientId] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createInvoice({
        project_id: projectId,
        client_id: clientId,
        amount: Number(amount),
        due_date: dueDate,
        notes,
      });

      toast.success(
        "Invoice created successfully"
      );

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create invoice"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          New Invoice
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Create Invoice
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <select
            required
            value={clientId}
            onChange={(e) =>
              setClientId(
                e.target.value
              )
            }
            className="w-full rounded-md border p-2"
          >
            <option value="">
              Select Client
            </option>

            {clients.map((client) => (
              <option
                key={client.id}
                value={client.id}
              >
                {client.full_name ||
                  client.email}
              </option>
            ))}
          </select>

          <select
            required
            value={projectId}
            onChange={(e) =>
              setProjectId(
                e.target.value
              )
            }
            className="w-full rounded-md border p-2"
          >
            <option value="">
              Select Project
            </option>

            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
              >
                {project.name}
              </option>
            ))}
          </select>

          <Input
            required
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
          />

          <Input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(
                e.target.value
              )
            }
          />

          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) =>
              setNotes(
                e.target.value
              )
            }
            className="min-h-24 w-full rounded-md border p-3"
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Invoice"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}