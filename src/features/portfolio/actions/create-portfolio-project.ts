"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

type Input = {
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

export async function createPortfolioProject(
  values: Input
) {
  const supabase =
    await createClient();

  const { error } =
    await supabase
      .from(
        "portfolio_projects"
      )
      .insert(values);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/portfolio"
  );
}