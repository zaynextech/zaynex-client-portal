"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const VALID_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
] as const;

export async function updateLead(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const website = String(formData.get("website") || "").trim();
  const source = String(formData.get("source") || "").trim();
  const service = String(formData.get("service") || "").trim();
  const status = String(formData.get("status") || "NEW").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!id) {
    throw new Error("Lead ID is required.");
  }

  if (!name) {
    throw new Error("Lead name is required.");
  }

  if (
    !VALID_STATUSES.includes(
      status as (typeof VALID_STATUSES)[number]
    )
  ) {
    throw new Error("Invalid lead status.");
  }

  const { error } = await supabase
    .from("leads")
    .update({
      name,
      company: company || null,
      email: email || null,
      phone: phone || null,
      website: website || null,
      source: source || null,
      service: service || null,
      status,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("assigned_to", user.id);

  if (error) {
    console.error("UPDATE LEAD ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/sales/leads");
  revalidatePath(`/sales/leads/${id}`);
  revalidatePath(`/sales/leads/${id}/edit`);

  redirect(`/sales/leads/${id}`);
}