"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { ProjectStatusBadge } from "./components/project-status-badge";
import { ProjectProgress } from "./components/ProjectProgress";

export type Project = {
  id: string;
  name: string;
  status: string;
  progress: number;
  due_date: string | null;
  client: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Project",
    cell: ({ row }) => (
      <Link
        href={`/admin/projects/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <ProjectStatusBadge
        status={row.original.status}
      />
    ),
  },

  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => (
      <ProjectProgress
        progress={row.original.progress}
      />
    ),
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
          href={`/admin/projects/${row.original.id}`}
        >
          View
        </Link>
      </Button>
    ),
  },
];