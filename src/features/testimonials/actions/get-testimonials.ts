"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTestimonials() {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data ?? [];
}