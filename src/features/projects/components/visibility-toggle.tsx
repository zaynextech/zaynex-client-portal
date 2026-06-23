"use client";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import { toggleClientVisibility } from "@/features/projects/actions/toggle-client-visibility";

interface Props {
  id: string;
  projectId: string;
  visible: boolean;
  table:
    | "project_tasks"
    | "project_files"
    | "project_timeline";
}

export function VisibilityToggle({
  id,
  projectId,
  visible,
  table,
}: Props) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() =>
        toggleClientVisibility(
          table,
          id,
          visible,
          projectId
        )
      }
    >
      {visible ? (
        <>
          <Eye className="mr-2 h-4 w-4" />
          Client
        </>
      ) : (
        <>
          <EyeOff className="mr-2 h-4 w-4" />
          Internal
        </>
      )}
    </Button>
  );
}