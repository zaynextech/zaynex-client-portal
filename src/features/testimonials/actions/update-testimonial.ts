"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

interface Input {
  id: string;

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

export async function updateTestimonial(
  input: Input
) {
  const supabase =
    await createClient();

  const {
    id,
    ...values
  } = input;

  const { error } =
    await supabase
      .from("testimonials")
      .update(values)
      .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/testimonials"
  );

  revalidatePath(
    `/admin/testimonials/${id}`
  );
}