"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function deleteProjectTask(
  taskId: string
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

  await supabase
    .from("project_tasks")
    .delete()
    .eq("id", taskId);

  revalidatePath(
    `/admin/projects/${task.project_id}`
  );

  return {
    success: true,
  };
}