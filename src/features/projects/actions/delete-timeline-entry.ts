"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteTimelineEntry(
  timelineId: string,
  projectId: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("project_timeline")
    .delete()
    .eq("id", timelineId)
    .eq("project_id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(
    `/admin/projects/${projectId}`
  );
}