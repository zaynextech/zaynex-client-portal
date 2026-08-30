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

export async function updateLeadStatus(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  if (!id || !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error("Invalid lead status");
  }

  const { error } = await supabase
    .from("leads")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("assigned_to", user.id);

  if (error) {
    console.error("UPDATE LEAD STATUS ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/sales/leads");
  revalidatePath(`/sales/leads/${id}`);

  redirect(`/sales/leads/${id}`);
}