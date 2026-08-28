"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return { supabase, user };
}

export async function createTask(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const projectId = String(formData.get("project_id") || "");
  const assignedTo = String(formData.get("assigned_to") || "");
  const priority = String(formData.get("priority") || "MEDIUM");
  const dueDate = String(formData.get("due_date") || "");

  if (!title || !projectId || !assignedTo) {
    throw new Error("Please complete all required fields");
  }

  // CHECK DUPLICATE TASK
  const { data: existingTask, error: checkError } = await supabase
    .from("tasks")
    .select("id")
    .eq("project_id", projectId)
    .eq("assigned_to", assignedTo)
    .ilike("title", title)
    .maybeSingle();

  if (checkError) {
    throw new Error(checkError.message);
  }

  if (existingTask) {
    throw new Error(
      "This task has already been assigned to this developer."
    );
  }

  // CREATE TASK
  const { error: taskError } = await supabase
    .from("tasks")
    .insert({
      title,
      description: description || null,
      project_id: projectId,
      assigned_to: assignedTo,
      created_by: user.id,
      priority,
      status: "TODO",
      due_date: dueDate || null,
    });

  if (taskError) {
    throw new Error(taskError.message);
  }

  // ADD DEVELOPER TO PROJECT
  const { data: existingMember, error: memberCheckError } =
    await supabase
      .from("project_members")
      .select("id")
      .eq("project_id", projectId)
      .eq("user_id", assignedTo)
      .maybeSingle();

  if (memberCheckError) {
    throw new Error(memberCheckError.message);
  }

  if (!existingMember) {
    const { error: memberError } = await supabase
      .from("project_members")
      .insert({
        project_id: projectId,
        user_id: assignedTo,
      });

    if (memberError) {
      throw new Error(memberError.message);
    }
  }

  revalidatePath("/admin/tasks");
  revalidatePath("/developer/tasks");
  revalidatePath("/developer/projects");
}
// DELETE TASK
export async function deleteTask(taskId: string) {
  const { supabase } = await requireAdmin();

  if (!taskId) {
    throw new Error("Invalid task");
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/tasks");
  revalidatePath("/developer/tasks");
}