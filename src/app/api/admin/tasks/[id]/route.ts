import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteProps
) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const {
    title,
    description,
    assigned_to,
    project_id,
    priority,
    status,
    due_date,
  } = body;

  if (!title?.trim()) {
    return NextResponse.json(
      { error: "Task title is required." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({
      title: title.trim(),
      description: description?.trim() || null,
      assigned_to: assigned_to || null,
      project_id: project_id || null,
      priority,
      status,
      due_date: due_date || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    task: data,
  });
}