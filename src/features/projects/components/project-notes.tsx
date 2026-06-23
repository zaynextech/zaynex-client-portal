"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { createProjectNote } from "@/features/projects/actions/create-project-note";

interface Props {
  projectId: string;
}

export function ProjectNotes({
  projectId,
}: Props) {
  const [note, setNote] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "projectId",
        projectId
      );

      formData.append(
        "note",
        note
      );

      await createProjectNote(
        formData
      );

      toast.success(
        "Note added"
      );

      setNote("");

      location.reload();
    } catch  {
      toast.error(
        "Failed to add note"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Internal project note..."
        value={note}
        onChange={(e) =>
          setNote(
            e.target.value
          )
        }
      />

      <Button
        onClick={handleSubmit}
        disabled={
          loading || !note
        }
      >
        {loading
          ? "Saving..."
          : "Add Note"}
      </Button>
    </div>
  );
}