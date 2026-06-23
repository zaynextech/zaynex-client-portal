"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Project = {
  name: string;
  client: string;
  status: string;
  progress: number;
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Project",
  },
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => `${row.original.progress}%`,
  },
];