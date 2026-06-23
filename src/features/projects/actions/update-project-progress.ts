"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProjectProgress(
  projectId: string,
  progress: number
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({
      progress,
    })
    .eq("id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(
    `/admin/projects/${projectId}`
  );
}