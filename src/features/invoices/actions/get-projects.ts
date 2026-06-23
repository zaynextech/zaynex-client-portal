import { createClient } from "@/lib/supabase/server";

export async function getProjects() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      status,
      progress
    `)
    .order("name");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}