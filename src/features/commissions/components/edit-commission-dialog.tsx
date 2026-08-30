"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { updateCommission } from "@/features/commissions/actions/update-commission";

interface Props {
  commission: {
    id: string;
    amount: number | null;
    rate: number | null;
    status: string;
    paid_at: string | null;
  };
}

export function EditCommissionDialog({ commission }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [rate, setRate] = useState(
    Number(commission.rate ?? 0)
  );

  const [amount, setAmount] = useState(
    Number(commission.amount ?? 0)
  );

  const [status, setStatus] = useState<"PENDING" | "PAID">(
    commission.status === "PAID" ? "PAID" : "PENDING"
  );

  const [paidAt, setPaidAt] = useState(
    commission.paid_at
      ? commission.paid_at.split("T")[0]
      : ""
  );

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateCommission({
          id: commission.id,
          rate: Number(rate),
          amount: Number(amount),
          status,
          paid_at:
            status === "PAID"
              ? paidAt
                ? new Date(`${paidAt}T00:00:00`).toISOString()
                : new Date().toISOString()
              : null,
        });

        toast.success("Commission updated successfully");

        setOpen(false);

        window.location.reload();
      } catch (error) {
        console.error(error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update commission"
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          disabled={pending}
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[94vw] max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Commission</DialogTitle>

          <DialogDescription>
            Update the commission amount, rate, and payment status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Rate */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Commission Rate (%)
            </label>

            <Input
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={rate}
              onChange={(e) =>
                setRate(Number(e.target.value))
              }
              disabled={pending}
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Commission Amount ($)
            </label>

            <Input
              type="number"
              min={0}
              step="0.01"
              value={amount}
              onChange={(e) =>
                setAmount(Number(e.target.value))
              }
              disabled={pending}
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Payment Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as "PENDING" | "PAID"
                )
              }
              disabled={pending}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          {/* Paid Date */}
          {status === "PAID" && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Paid Date
              </label>

              <Input
                type="date"
                value={paidAt}
                onChange={(e) =>
                  setPaidAt(e.target.value)
                }
                disabled={pending}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSave}
              disabled={pending}
            >
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}