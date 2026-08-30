"use client";

import { useFormStatus } from "react-dom";

import { updateLeadStatus } from "@/features/leads/actions/update-lead-status";
import { Button } from "@/components/ui/button";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" disabled={pending}>
      {pending ? "Updating..." : "Change Status"}
    </Button>
  );
}

export function ChangeLeadStatus({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string | null;
}) {
  return (
    <form action={updateLeadStatus} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />

      <select
        name="status"
        defaultValue={currentStatus ?? "NEW"}
        className="h-10 rounded-md border bg-background px-3 text-sm"
      >
        <option value="NEW">New</option>
        <option value="CONTACTED">Contacted</option>
        <option value="QUALIFIED">Qualified</option>
        <option value="CONVERTED">Converted</option>
        <option value="LOST">Lost</option>
      </select>

      <SubmitButton />
    </form>
  );
}