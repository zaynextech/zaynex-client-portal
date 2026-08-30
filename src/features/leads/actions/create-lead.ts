"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createLead(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const name = String(formData.get("name") || "").trim();
  const company = String(formData.get("company") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const website = String(formData.get("website") || "").trim();
  const source = String(formData.get("source") || "").trim();
  const service = String(formData.get("service") || "").trim();
  const status = String(formData.get("status") || "NEW").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!name) {
    throw new Error("Lead name is required.");
  }

  const { error } = await supabase.from("leads").insert({
    name,
    company: company || null,
    email: email || null,
    phone: phone || null,
    website: website || null,
    source: source || null,
    service: service || null,
    status,
    notes: notes || null,
    assigned_to: user.id,
  });

  if (error) {
    console.error("CREATE LEAD ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/sales/leads");
  revalidatePath("/sales");

  redirect("/sales/leads");
}