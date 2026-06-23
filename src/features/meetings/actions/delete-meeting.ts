"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function deleteMeeting(
  id: string
) {
  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("meetings")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/meetings"
  );

  return {
    success: true,
  };
}