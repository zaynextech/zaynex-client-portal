import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  req: Request,
  { params }: Props
) {
  const { slug } =
    await params;

  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("portfolio_projects")
      .select("*")
      .eq(
        "slug",
        slug
      )
      .eq(
        "published",
        true
      )
      .single();

  if (
    error ||
    !data
  ) {
    return NextResponse.json(
      {
        error:
          "Not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    data
  );
}