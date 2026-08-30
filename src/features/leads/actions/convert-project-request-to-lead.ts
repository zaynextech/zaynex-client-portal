"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function convertProjectRequestToLead(
  projectRequestId: string
) {
  const supabase = await createClient();

  // Make sure the user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }

  // Make sure the user is an admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role?.toUpperCase() !== "ADMIN") {
    throw new Error("Unauthorized.");
  }

  // Get the project request
  const { data: request, error: requestError } = await supabase
    .from("project_requests")
    .select(`
      id,
      company_name,
      email,
      phone,
      project_name,
      project_type,
      description,
      budget_range,
      target_launch_date
    `)
    .eq("id", projectRequestId)
    .single();

  if (requestError || !request) {
    throw new Error("Project request not found.");
  }

  // Check if already converted
  const { data: existingLead } = await supabase
    .from("leads")
    .select("id")
    .eq("project_request_id", request.id)
    .maybeSingle();

  if (existingLead) {
    throw new Error("This project request is already a lead.");
  }

  // Create the lead
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      project_request_id: request.id,
      name: request.company_name,
      company: request.company_name,
      email: request.email,
      phone: request.phone,
      service: request.project_type,
      source: "WEBSITE",
      status: "NEW",
      notes: [
        request.project_name
          ? `Project: ${request.project_name}`
          : null,
        request.budget_range
          ? `Budget: ${request.budget_range}`
          : null,
        request.target_launch_date
          ? `Target launch: ${request.target_launch_date}`
          : null,
        request.description
          ? `Description:\n${request.description}`
          : null,
      ]
        .filter(Boolean)
        .join("\n\n"),
    })
    .select("id")
    .single();

  if (leadError) {
    console.error("Convert lead error:", leadError);
    throw new Error(leadError.message);
  }

  revalidatePath("/admin/project-requests");
  revalidatePath("/sales/leads");
  revalidatePath("/sales");

  return {
    success: true,
    leadId: lead.id,
  };
}