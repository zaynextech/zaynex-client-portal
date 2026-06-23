"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function updateProjectTaskStatus(
  taskId: string,
  status:
    | "TODO"
    | "IN_PROGRESS"
    | "REVIEW"
    | "DONE"
) {
  const supabase =
    await createClient();

  const {
    data: task,
  } = await supabase
    .from("project_tasks")
    .select(
      "project_id"
    )
    .eq("id", taskId)
    .single();

  if (!task) {
    throw new Error(
      "Task not found"
    );
  }

  const { error } =
    await supabase
      .from("project_tasks")
      .update({
        status,
      })
      .eq("id", taskId);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    `/admin/projects/${task.project_id}`
  );

  return {
    success: true,
  };
}