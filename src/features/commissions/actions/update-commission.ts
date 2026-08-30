"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface UpdateCommissionInput {
  id: string;
  rate: number;
  amount: number;
  status: "PENDING" | "PAID";
  paid_at: string | null;
}

export async function updateCommission({
  id,
  rate,
  amount,
  status,
  paid_at,
}: UpdateCommissionInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Admin only
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    profile?.role?.toUpperCase() !== "ADMIN"
  ) {
    throw new Error("Unauthorized");
  }

  const safeRate = Math.min(
    Math.max(Number(rate) || 0, 0),
    100
  );

  const safeAmount = Math.max(
    Number(amount) || 0,
    0
  );

  const finalPaidAt =
    status === "PAID"
      ? paid_at || new Date().toISOString()
      : null;

  const { error } = await supabase
    .from("commissions")
    .update({
      rate: safeRate,
      amount: safeAmount,
      status,
      paid_at: finalPaidAt,
    })
    .eq("id", id);

  if (error) {
    console.error("UPDATE COMMISSION ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/sales");
  revalidatePath("/sales");

  return {
    success: true,
  };
}