"use server";

import { createClient } from "@/lib/supabase/server";

interface CreateProjectCommissionInput {
  projectId: string;
  salespersonId: string;
  rate: number;
}

export async function createProjectCommission({
  projectId,
  salespersonId,
  rate,
}: CreateProjectCommissionInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Admin only
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role?.toUpperCase() !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Get project budget
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, budget")
    .eq("id", projectId)
    .single();

  if (projectError || !project) {
    throw new Error("Project not found");
  }

  const safeRate = Math.max(Number(rate) || 0, 0);
  const budget = Number(project.budget) || 0;

  const amount = Number(
    ((budget * safeRate) / 100).toFixed(2)
  );

  // Check existing commission
  const { data: existing } = await supabase
    .from("commissions")
    .select("id, status")
    .eq("project_id", projectId)
    .eq("salesperson_id", salespersonId)
    .maybeSingle();

  if (existing) {
    // Don't modify an already-paid commission
    if (existing.status === "PAID") {
      return {
        success: true,
        message: "Commission is already paid.",
      };
    }

    const { error } = await supabase
      .from("commissions")
      .update({
        amount,
        rate: safeRate,
      })
      .eq("id", existing.id);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Commission updated.",
    };
  }

  // Create commission
  const { error } = await supabase
    .from("commissions")
    .insert({
      project_id: projectId,
      salesperson_id: salespersonId,
      amount,
      rate: safeRate,
      status: "PENDING",
    });

  if (error) {
    console.error("CREATE COMMISSION ERROR:", error);
    throw new Error(error.message);
  }

  return {
    success: true,
    message: "Commission created.",
  };
}