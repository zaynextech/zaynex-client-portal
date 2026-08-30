import { createClient } from "@/lib/supabase/server";

export async function getProjects() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      client:profiles!projects_client_id_fkey(
        id,
        full_name,
        email
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "GET PROJECTS ERROR:",
      JSON.stringify(error, null, 2)
    );
    return [];
  }

  return data ?? [];
}