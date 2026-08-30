"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const VALID_TYPES = [
  "CALL",
  "WHATSAPP",
  "EMAIL",
  "NOTE",
  "MEETING",
] as const;

export async function createLeadActivity(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const leadId = String(formData.get("lead_id") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const followUpAt = String(
    formData.get("follow_up_at") || ""
  ).trim();

  if (!leadId) {
    throw new Error("Lead ID is required.");
  }

  if (
    !VALID_TYPES.includes(
      type as (typeof VALID_TYPES)[number]
    )
  ) {
    throw new Error("Invalid activity type.");
  }

  if (!notes) {
    throw new Error("Activity notes are required.");
  }

  // Make sure this lead belongs to the logged-in sales user
  const { data: lead } = await supabase
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .eq("assigned_to", user.id)
    .single();

  if (!lead) {
    throw new Error("Lead not found.");
  }

  const { error } = await supabase
    .from("lead_activities")
    .insert({
      lead_id: leadId,
      user_id: user.id,
      type,
      subject: subject || null,
      notes,
      follow_up_at: followUpAt || null,
    });

  if (error) {
    console.error("CREATE LEAD ACTIVITY ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/sales/leads/${leadId}`);
}