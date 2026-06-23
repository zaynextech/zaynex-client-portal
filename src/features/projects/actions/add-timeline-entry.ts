"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

interface AddTimelineEntryInput {
  project_id: string;
  title: string;
  description?: string;
  status?: string;
}

export async function addTimelineEntry(
  data: AddTimelineEntryInput
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("project_timeline")
    .insert({
      project_id: data.project_id,
      title: data.title,
      description:
        data.description || null,
      status:
        data.status || "PENDING",
    });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  revalidatePath(
    `/admin/projects/${data.project_id}`
  );

  return {
    success: true,
  };
}