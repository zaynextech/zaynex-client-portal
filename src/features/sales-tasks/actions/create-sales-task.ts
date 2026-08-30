"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const VALID_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
] as const;

export async function createSalesTask(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const title = String(
    formData.get("title") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const priority = String(
    formData.get("priority") || "MEDIUM"
  ).trim();

  const dueDate = String(
    formData.get("due_date") || ""
  ).trim();

  if (!title) {
    throw new Error("Task title is required.");
  }

  if (
    !VALID_PRIORITIES.includes(
      priority as (typeof VALID_PRIORITIES)[number]
    )
  ) {
    throw new Error("Invalid task priority.");
  }

  const { error } = await supabase
    .from("sales_tasks")
    .insert({
      title,
      description: description || null,
      assigned_to: user.id,
      created_by: user.id,
      priority,
      status: "PENDING",
      due_date: dueDate
        ? new Date(dueDate).toISOString()
        : null,
    });

  if (error) {
    console.error("CREATE SALES TASK ERROR:", error);
    throw new Error(error.message);
  }

  revalidatePath("/sales/tasks");
  revalidatePath("/sales");

  redirect("/sales/tasks");
}