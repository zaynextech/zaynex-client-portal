"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TaskPaymentProps {
  taskId: string;
  paymentAmount: number | null;
  paymentCurrency: string | null;
  paymentStatus: string | null;
  paidAt: string | null;
}

export function TaskPayment({
  taskId,
  paymentAmount,
  paymentCurrency,
  paymentStatus,
  paidAt,
}: TaskPaymentProps) {
  const supabase = createClient();

  const [amount, setAmount] = useState(
    paymentAmount?.toString() ?? ""
  );
  const [currency, setCurrency] = useState(
    paymentCurrency ?? "USD"
  );
  const [status, setStatus] = useState(
    paymentStatus ?? "UNPAID"
  );
  const [saving, setSaving] = useState(false);

  async function savePayment() {
    setSaving(true);

    const { error } = await supabase
      .from("tasks")
      .update({
        payment_amount: amount ? Number(amount) : null,
        payment_currency: currency,
        payment_status: status,
        paid_at:
          status === "PAID"
            ? paidAt ?? new Date().toISOString()
            : null,
      })
      .eq("id", taskId);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Amount */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Payment Amount
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Currency
          </label>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="USD">USD</option>
            <option value="SSP">SSP</option>
            <option value="INR">INR</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Payment Status
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="UNPAID">Unpaid</option>
          <option value="PAID">Paid</option>
        </select>
      </div>

      {/* Paid date */}
      {paidAt && status === "PAID" && (
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">
            Paid At
          </p>

          <p className="mt-1 text-sm font-medium">
            {new Date(paidAt).toLocaleString()}
          </p>
        </div>
      )}

      {/* Save */}
      <button
        type="button"
        onClick={savePayment}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {saving && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {status === "PAID" && !saving && (
          <CheckCircle2 className="h-4 w-4" />
        )}

        {saving ? "Saving..." : "Save Payment"}
      </button>
    </div>
  );
}