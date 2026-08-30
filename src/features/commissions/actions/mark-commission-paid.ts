"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markCommissionPaid(id: string) {
  // Prevent null/invalid UUID from reaching Supabase
  if (!id || id === "null" || id === "undefined") {
    throw new Error("Invalid commission ID.");
  }

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

  // Mark commission as paid
  const { data: commission, error } = await supabase
    .from("commissions")
    .update({
      status: "PAID",
      paid_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "PENDING")
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("MARK COMMISSION PAID ERROR:", error);
    throw new Error(error.message);
  }

  if (!commission) {
    throw new Error(
      "Commission is already paid or does not exist."
    );
  }

  revalidatePath("/admin/sales");
  revalidatePath("/sales");

  return {
    success: true,
  };
}