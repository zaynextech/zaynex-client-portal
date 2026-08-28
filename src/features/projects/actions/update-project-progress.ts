"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProjectProgress(
  projectId: string,
  progress: number
) {
  const supabase = await createClient();

  const safeProgress = Math.min(Math.max(progress, 0), 100);

  const { error } = await supabase
    .from("projects")
    .update({
      progress: safeProgress,
    })
    .eq("id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/developer/projects/${projectId}`);
  revalidatePath("/admin/projects");
  revalidatePath("/developer/projects");
}