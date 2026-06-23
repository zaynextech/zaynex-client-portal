"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function createProjectNote(
  formData: FormData
) {
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

  const projectId =
    formData.get(
      "projectId"
    ) as string;

  const note =
    formData.get(
      "note"
    ) as string;

  if (!note?.trim()) {
    throw new Error(
      "Note is required"
    );
  }

  const { error } =
    await supabase
      .from("project_notes")
      .insert({
        project_id:
          projectId,
        admin_id: user.id,
        note: note.trim(),
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