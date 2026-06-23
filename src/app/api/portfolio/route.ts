import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("published", true)
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    data
  );
}