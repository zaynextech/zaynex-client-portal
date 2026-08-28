"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateTaskStatus(
  taskId: string,
  status: "TODO" | "IN_PROGRESS" | "COMPLETED"
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Developer can only update their own task
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("id, project_id")
    .eq("id", taskId)
    .eq("assigned_to", user.id)
    .single();

  if (taskError || !task) {
    throw new Error("Task not found or unauthorized");
  }

  const { error } = await supabase
    .from("tasks")
    .update({
      status,
    })
    .eq("id", taskId)
    .eq("assigned_to", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/developer/projects/${task.project_id}`);
  revalidatePath("/developer/projects");
  revalidatePath("/developer/tasks");
  revalidatePath(`/admin/projects/${task.project_id}`);
  revalidatePath("/admin/tasks");
}