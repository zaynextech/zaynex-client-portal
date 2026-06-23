"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

interface Input {
  client_name: string;
  role: string;
  company: string;
  rating: number;
  review_text: string;
  rating_type:
    | "GOOGLE"
    | "TRUSTPILOT";
  published: boolean;
}

export async function createTestimonial(
  input: Input
) {
  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("testimonials")
      .insert(input);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/testimonials"
  );
}