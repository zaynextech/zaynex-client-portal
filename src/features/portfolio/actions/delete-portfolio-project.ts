"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function deletePortfolioProject(
  id: string
) {
  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(
        "portfolio_projects"
      )
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/portfolio"
  );
}