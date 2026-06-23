"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPortfolioProject(
  id: string
) {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from(
        "portfolio_projects"
      )
      .select("*")
      .eq("id", id)
      .single();

  if (error) {
    return null;
  }

  return data;
}