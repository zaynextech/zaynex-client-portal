"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleClientVisibility(
  table:
    | "project_tasks"
    | "project_files"
    | "project_timeline",
  id: string,
  visible: boolean,
  projectId: string
) {
  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(table)
      .update({
        visible_to_client:
          !visible,
      })
      .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    `/admin/projects/${projectId}`
  );

  revalidatePath(
    `/client/projects/${projectId}`
  );
}