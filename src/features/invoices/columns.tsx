"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

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

function InvoiceStatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span className="rounded-md border px-2 py-1 text-xs">
      {status}
    </span>
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
      row.original.project?.name ||
      "-",
  },

  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) =>
      `$${Number(
        row.original.amount
      ).toFixed(2)}`,
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <InvoiceStatusBadge
        status={row.original.status}
      />
    ),
  },

  {
    accessorKey: "issue_date",
    header: "Issue Date",
    cell: ({ row }) => {
      if (!row.original.issue_date) {
        return "-";
      }

      return new Intl.DateTimeFormat(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ).format(
        new Date(
          row.original.issue_date
        )
      );
    },
  },

  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      if (!row.original.due_date) {
        return "-";
      }

      return new Intl.DateTimeFormat(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ).format(
        new Date(
          row.original.due_date
        )
      );
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