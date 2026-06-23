import { createClient } from "@/lib/supabase/server";

export async function getProjectTimeline(
  projectId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_timeline")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}