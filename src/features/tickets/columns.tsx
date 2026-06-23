"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Ticket } from "./types";
import { TicketStatusBadge } from "./components/ticket-status-badge";

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <TicketStatusBadge
        status={row.original.status}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
];