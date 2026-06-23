"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function deleteProjectRequest(
  requestId: string
) {
  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from("project_requests")
      .delete()
      .eq("id", requestId);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/project-requests"
  );
}