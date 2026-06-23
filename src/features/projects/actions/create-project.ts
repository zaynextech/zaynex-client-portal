"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

interface CreateProjectInput {
  client_id: string;
  name: string;
  description?: string;
  budget?: number;
  start_date?: string;
  due_date?: string;
}

export async function createProject(
  data: CreateProjectInput
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
  .from("projects")
  .insert({
    client_id: data.client_id,
    name: data.name,
    description:
      data.description || null,

    status: "PENDING",
    progress: 0,

    budget:
      data.budget || null,

    start_date:
      data.start_date || null,

    due_date:
      data.due_date || null,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/projects");

  return {
    success: true,
  };
}