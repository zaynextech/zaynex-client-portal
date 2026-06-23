"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTestimonial(
  id: string
) {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("testimonials")
      .select("*")
      .eq("id", id)
      .single();

  if (error) {
    return null;
  }

  return data;
}