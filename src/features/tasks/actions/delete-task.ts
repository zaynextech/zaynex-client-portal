"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteTask(taskId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!taskId) {
    throw new Error("Task ID is required.");
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("assigned_to", user.id);

  if (error) {
    console.error("DELETE TASK ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/sales/tasks");
  revalidatePath("/sales");

  redirect("/sales/tasks");
}