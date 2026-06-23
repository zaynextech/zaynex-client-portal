// src/features/clients/actions.ts

import { createClient } from "@/lib/supabase/server";

export async function getClients() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      email,
      role,
      full_name,
      company_name,
      avatar_url,
      created_at
    `)
    .eq("role", "CLIENT")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to fetch clients:",
      error
    );

    return [];
  }

  return data;
}

export async function getClientById(
  id: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(
      "Failed to fetch client:",
      error
    );

    return null;
  }

  return data;
}