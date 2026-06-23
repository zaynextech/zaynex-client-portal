"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type Input = {
  id: string;

  title: string;
  slug: string;
  category: string;

  short_description: string;
  full_description: string;

  thumbnail_url: string;
  gallery: string[];

  demo_url: string;

  featured: boolean;
  published: boolean;
};

export async function updatePortfolioProject(
  values: Input
) {
  const supabase =
    await createClient();

  const {
    id,
    ...updates
  } = values;

  const { error } =
    await supabase
      .from(
        "portfolio_projects"
      )
      .update(updates)
      .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/portfolio"
  );

  revalidatePath(
    `/admin/portfolio/${id}`
  );

  revalidatePath(
    "/portfolio"
  );
}