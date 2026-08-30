"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteLead(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("Lead ID is required.");
  }

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("assigned_to", user.id);

  if (error) {
    console.error("DELETE LEAD ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/sales/leads");
  revalidatePath("/sales");

  redirect("/sales/leads");
}