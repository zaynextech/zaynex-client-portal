"use client";

import Link from "next/link";

import { ColumnDef } from "@tanstack/react-table";

export type Client = {
  id: string;
  full_name: string | null;
  email: string;
  company_name: string | null;
  role: string;
  created_at: string;
};

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/admin/clients/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.original.full_name ||
          "Unnamed Client"}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <Link
        href={`/admin/clients/${row.original.id}`}
        className="hover:underline"
      >
        {row.original.email}
      </Link>
    ),
  },
  {
    accessorKey: "company_name",
    header: "Company",
    cell: ({ row }) =>
      row.original.company_name ||
      "-",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="rounded-md border px-2 py-1 text-xs">
        {row.original.role}
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Joined",
    cell: ({ row }) =>
      new Date(
        row.original.created_at
      ).toLocaleDateString(),
  },
];