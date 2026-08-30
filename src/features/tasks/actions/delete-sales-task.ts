"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteSalesTask(taskId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("sales_tasks")
    .delete()
    .eq("id", taskId)
    .or(`assigned_to.eq.${user.id},created_by.eq.${user.id}`);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/sales/tasks");
  redirect("/sales/tasks");
}