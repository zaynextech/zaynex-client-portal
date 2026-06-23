"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

interface UpdateProjectInput {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  budget: number | null;
  start_date: string | null;
  due_date: string | null;
}

export async function updateProject({
  id,
  name,
  description,
  status,
  progress,
  budget,
  start_date,
  due_date,
}: UpdateProjectInput) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "Unauthorized"
    );
  }

  const { error } =
    await supabase
      .from("projects")
      .update({
        name,
        description,
        status,
        progress,
        budget,
        start_date,
        due_date,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

  if (error) {
    console.error(
      "UPDATE PROJECT ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/projects"
  );

  revalidatePath(
    `/admin/projects/${id}`
  );

  revalidatePath(
    "/client/projects"
  );

  return {
    success: true,
  };
}