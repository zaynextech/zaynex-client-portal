"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";

import { Project } from "./types";
import { ProjectStatusBadge } from "./components/project-status-badge";
import { ProjectProgress } from "./components/ProjectProgress";

export const clientColumns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Project",
    cell: ({ row }) => (
      <Link
        href={`/client/projects/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
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
        value={row.original.progress}
      />
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
];