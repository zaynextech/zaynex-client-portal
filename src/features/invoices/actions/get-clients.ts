import { createClient } from "@/lib/supabase/server";

export async function getClients() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email
    `)
    .eq("role", "CLIENT")
    .order("full_name");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}