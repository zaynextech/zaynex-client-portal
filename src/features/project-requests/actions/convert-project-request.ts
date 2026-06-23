"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function convertProjectRequest(
  requestId: string
) {
  const supabase =
    await createClient();

  const {
    data: request,
    error: requestError,
  } = await supabase
    .from("project_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (requestError) {
    console.error(
      "REQUEST FETCH ERROR:",
      requestError
    );

    throw new Error(
      requestError.message
    );
  }

  console.log(
    "PROJECT REQUEST:",
    request
  );

  if (!request) {
    throw new Error(
      "Project request not found"
    );
  }

  if (!request.client_id) {
    throw new Error(
      "This request is not linked to a client account. Click 'Create Client Account' first."
    );
  }

  if (
    request.status ===
    "Converted"
  ) {
    throw new Error(
      "This request has already been converted."
    );
  }

  const {
    data: project,
    error: projectError,
  } = await supabase
    .from("projects")
    .insert({
      client_id:
        request.client_id,
      name:
        request.project_name,
      description:
        request.description,
      status: "Planning",
      progress: 0,
      due_date:
        request.target_launch_date,
    })
    .select()
    .single();

  if (projectError) {
    console.error(
      "PROJECT CREATE ERROR:",
      projectError
    );

    throw new Error(
      projectError.message
    );
  }

  const {
    error: updateError,
  } = await supabase
    .from("project_requests")
    .update({
      status: "Converted",
    })
    .eq("id", requestId);

  if (updateError) {
    console.error(
      "REQUEST UPDATE ERROR:",
      updateError
    );

    throw new Error(
      updateError.message
    );
  }

  revalidatePath(
    "/admin/project-requests"
  );

  revalidatePath(
    `/admin/project-requests/${requestId}`
  );

  revalidatePath(
    "/admin/projects"
  );

  return project;
}