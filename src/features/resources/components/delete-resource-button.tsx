"use client";

import { useState } from "react";

interface Props {
  resourceId: string;
}

export function DeleteResourceButton({
  resourceId,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this resource? The PDF will also be removed from Cloudinary."
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/resources/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: resourceId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to delete resource."
        );
      }

      window.location.reload();
    } catch (error) {
      console.error("DELETE RESOURCE ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete resource."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="rounded-md border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}