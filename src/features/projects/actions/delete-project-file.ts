"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteProjectFile(
  fileId: string,
  projectId: string
) {
  const supabase = await createClient();

  const { error } =
    await supabase
      .from("project_files")
      .delete()
      .eq("id", fileId);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    `/admin/projects/${projectId}`
  );
}