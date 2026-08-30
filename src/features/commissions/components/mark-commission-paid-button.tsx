"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { markCommissionPaid } from "@/features/commissions/actions/mark-commission-paid";

interface Props {
  commissionId: string;
}

export function MarkCommissionPaidButton({
  commissionId,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handlePay = () => {
    startTransition(async () => {
      try {
        await markCommissionPaid(commissionId);

        toast.success("Commission marked as paid");

        // Refresh commission data immediately
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update commission"
        );
      }
    });
  };

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={handlePay}
      className="gap-1.5"
    >
      <CheckCircle2 className="h-4 w-4" />

      {pending ? "Updating..." : "Mark as Paid"}
    </Button>
  );
}