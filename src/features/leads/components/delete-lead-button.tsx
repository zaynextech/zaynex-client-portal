"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteLead } from "@/features/leads/actions/delete-lead";
import { Button } from "@/components/ui/button";

export function DeleteLeadButton({ id }: { id: string }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead? This cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(true);

    const formData = new FormData();
    formData.set("id", id);

    await deleteLead(formData);
  }

  return (
    <Button
      type="button"
      variant="destructive"
      onClick={handleDelete}
      disabled={deleting}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {deleting ? "Deleting..." : "Delete Lead"}
    </Button>
  );
}