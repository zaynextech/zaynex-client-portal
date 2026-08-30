"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

const VALID_STATUSES = [
  "TODO",
  "IN_PROGRESS",
  "COMPLETED",
] as const;

export async function updateTask(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priority = String(formData.get("priority") || "MEDIUM").trim();
  const status = String(formData.get("status") || "TODO").trim();
  const dueDate = String(formData.get("due_date") || "").trim();

  if (!id) {
    throw new Error("Task ID is required.");
  }

  if (!title) {
    throw new Error("Task title is required.");
  }

  if (
    !VALID_PRIORITIES.includes(
      priority as (typeof VALID_PRIORITIES)[number]
    )
  ) {
    throw new Error("Invalid priority.");
  }

  if (
    !VALID_STATUSES.includes(
      status as (typeof VALID_STATUSES)[number]
    )
  ) {
    throw new Error("Invalid task status.");
  }

  const { data: task, error: taskError } = await supabase
    .from("sales_tasks")
    .select("id")
    .eq("id", id)
    .or(`assigned_to.eq.${user.id},created_by.eq.${user.id}`)
    .single();

  if (taskError || !task) {
    throw new Error("Task not found or unauthorized.");
  }

  const { error } = await supabase
    .from("sales_tasks")
    .update({
      title,
      description: description || null,
      priority,
      status,
      due_date: dueDate
        ? new Date(dueDate).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("UPDATE SALES TASK ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/sales/tasks");
  revalidatePath(`/sales/tasks/${id}`);
  revalidatePath(`/sales/tasks/${id}/edit`);

  redirect(`/sales/tasks/${id}`);
}