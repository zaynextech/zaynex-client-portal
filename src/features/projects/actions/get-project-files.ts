import { createClient } from "@/lib/supabase/server";

export async function getProjectFiles(
  projectId: string
) {
  const supabase = await createClient();

  const { data, error } =
    await supabase
      .from("project_files")
      .select(`
        id,
        file_name,
        file_url,
        file_size,
        created_at,
        uploaded_by
      `)
      .eq("project_id", projectId)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(error);

    return [];
  }

  return data;
}