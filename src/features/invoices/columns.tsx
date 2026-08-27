"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateInvoiceStatus } from "@/features/invoices/actions/update-invoice-status";

export type Invoice = {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  issue_date: string | null;
  due_date: string | null;
  notes: string | null;

  client: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;

  project: {
    id: string;
    name: string;
  } | null;
};

function getStatusClasses(status: string) {
  switch (status) {
    case "Paid":
      return "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400";

    case "Overdue":
      return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400";

    case "Pending":
    default:
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
  }
}

function InvoiceStatusBadge({
  status,
  invoiceId,
}: {
  status: string;
  invoiceId: string;
}) {
  async function handleStatusChange(value: string) {
    try {
      await updateInvoiceStatus(
        invoiceId,
        value as "Pending" | "Paid" | "Overdue"
      );

      toast.success("Invoice status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update invoice status");
    }
  }

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
    >
      <SelectTrigger
        className={`h-8 w-31.25 rounded-full text-xs font-semibold ${getStatusClasses(
          status
        )}`}
      >
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="Pending">
          Pending
        </SelectItem>

        <SelectItem value="Paid">
          Paid
        </SelectItem>

        <SelectItem value="Overdue">
          Overdue
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoice_number",
    header: "Invoice #",
  },

  {
    id: "client",
    header: "Client",
    cell: ({ row }) =>
      row.original.client?.full_name ||
      row.original.client?.email ||
      "-",
  },

  {
    id: "project",
    header: "Project",
    cell: ({ row }) =>
      row.original.project?.name || "-",
  },

  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) =>
      `$${Number(row.original.amount).toFixed(2)}`,
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <InvoiceStatusBadge
        status={row.original.status}
        invoiceId={row.original.id}
      />
    ),
  },

  {
    accessorKey: "issue_date",
    header: "Issue Date",
    cell: ({ row }) => {
      const date = row.original.issue_date;

      if (!date) {
        return "-";
      }

      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date));
    },
  },

  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      const date = row.original.due_date;

      if (!date) {
        return "-";
      }

      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(date));
    },
  },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button
        asChild
        size="sm"
        variant="outline"
      >
        <Link
          href={`/admin/invoices/${row.original.id}`}
        >
          View
        </Link>
      </Button>
    ),
  },
];