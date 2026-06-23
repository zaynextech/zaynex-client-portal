"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function createProjectTask(
  formData: FormData
) {
  const supabase =
    await createClient();

  const projectId =
    formData.get(
      "projectId"
    ) as string;

  const title =
    formData.get(
      "title"
    ) as string;

  const description =
    formData.get(
      "description"
    ) as string;

  const { error } =
    await supabase
      .from("project_tasks")
      .insert({
        project_id:
          projectId,
        title,
        description,
      });

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    `/admin/projects/${projectId}`
  );

  return {
    success: true,
  };
}