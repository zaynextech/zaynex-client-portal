"use server";

import { createClient } from "@/lib/supabase/server";

export async function getMeetings() {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("meetings")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data;
}