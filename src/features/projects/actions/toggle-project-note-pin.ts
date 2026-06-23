"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleProjectNotePin(
  noteId: string,
  pinned: boolean
) {
  const supabase =
    await createClient();

  const { data: note } =
    await supabase
      .from("project_notes")
      .select(
        "project_id"
      )
      .eq("id", noteId)
      .single();

  if (!note) {
    throw new Error(
      "Note not found"
    );
  }

  await supabase
    .from("project_notes")
    .update({
      pinned: !pinned,
    })
    .eq("id", noteId);

  revalidatePath(
    `/admin/projects/${note.project_id}`
  );
}