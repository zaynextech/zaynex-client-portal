"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface UpdateProjectInput {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  budget: number | null;
  commission_rate: number;
  start_date: string | null;
  due_date: string | null;
  salesperson_id: string | null;
}

export async function updateProject({
  id,
  name,
  description,
  status,
  progress,
  budget,
  start_date,
  due_date,
  salesperson_id,
  commission_rate,
}: UpdateProjectInput) {
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

  const safeProgress = Math.min(
    Math.max(Number(progress) || 0, 0),
    100
  );

  const safeBudget =
    budget === null || budget === undefined
      ? null
      : Number(budget);

  const safeRate = Math.min(
    Math.max(Number(commission_rate) || 0, 0),
    100
  );

  // Update project
  const { error } = await supabase
    .from("projects")
    .update({
      name: name.trim(),
      description,
      status,
      progress: safeProgress,
      budget: safeBudget,
      start_date,
      due_date,
      salesperson_id,
      commission_rate: safeRate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("UPDATE PROJECT ERROR:", error);
    throw new Error(error.message);
  }

  // No salesperson = no commission
  if (!salesperson_id) {
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath("/admin/sales");
    revalidatePath("/sales");

    return {
      success: true,
    };
  }

  // Calculate commission
  const commissionAmount = Number(
    (((safeBudget ?? 0) * safeRate) / 100).toFixed(2)
  );

  // Check if commission already exists
  const { data: existingCommission } = await supabase
    .from("commissions")
    .select("id, status")
    .eq("project_id", id)
    .maybeSingle();

  // IMPORTANT:
  // Never overwrite a commission that has already been paid.
  if (existingCommission?.status === "PAID") {
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath("/admin/sales");
    revalidatePath("/sales");

    return {
      success: true,
    };
  }

  if (existingCommission) {
    // Update existing pending commission
    const { error: commissionError } = await supabase
      .from("commissions")
      .update({
        salesperson_id,
        amount: commissionAmount,
        rate: safeRate,
        status: "PENDING",
        paid_at: null,
      })
      .eq("id", existingCommission.id);

    if (commissionError) {
      console.error(
        "UPDATE COMMISSION ERROR:",
        commissionError
      );

      throw new Error(commissionError.message);
    }
} else {
  // Create commission
  const { error: commissionError } = await supabase
    .from("commissions")
    .insert({
      project_id: id,
      salesperson_id,
      amount: commissionAmount,
      rate: safeRate,
      status: "PENDING",
      paid_at: null,
    });

  if (commissionError) {
    console.error(
      "CREATE COMMISSION ERROR:",
      commissionError
    );
    throw new Error(commissionError.message);
  }
}

  // Refresh pages
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/admin/sales");
  revalidatePath("/sales");

  return {
    success: true,
  };
}