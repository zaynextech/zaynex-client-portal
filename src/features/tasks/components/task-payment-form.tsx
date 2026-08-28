"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

interface TaskPaymentFormProps {
  taskId: string;
  currentAmount: number | null;
  currentStatus: string;
}

export function TaskPaymentForm({
  taskId,
  currentAmount,
  currentStatus,
}: TaskPaymentFormProps) {
  const router = useRouter();

  const [amount, setAmount] = useState(
    currentAmount !== null ? String(currentAmount) : ""
  );

  const [status, setStatus] = useState(currentStatus || "UNPAID");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!amount || Number.isNaN(numericAmount) || numericAmount < 0) {
      alert("Enter a valid payment amount.");
      return;
    }

    try {
      setSaving(true);

      const supabase = createClient();

      const { error } = await supabase
        .from("tasks")
        .update({
          payment_amount: numericAmount,
          payment_status: status,
          paid_at: status === "PAID" ? new Date().toISOString() : null,
        })
        .eq("id", taskId);

      if (error) {
        throw new Error(error.message);
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to update payment:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update payment."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Payment Amount
          </label>

          <Input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Enter amount"
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Payment Status
          </label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            disabled={saving}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="UNPAID">Unpaid</option>
            <option value="PAID">Paid</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Payment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}