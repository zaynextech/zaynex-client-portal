// src/features/project-requests/actions/create-project-from-request.ts

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function createProjectFromRequest(
  formData: FormData
) {
  const supabase =
    await createClient();

  const requestId =
    formData.get(
      "requestId"
    ) as string;

  const projectName =
    formData.get(
      "projectName"
    ) as string;

  const description =
    formData.get(
      "description"
    ) as string;

  const budget =
    formData.get(
      "budget"
    ) as string;

  const dueDate =
    formData.get(
      "dueDate"
    ) as string;

  const { data: request } =
    await supabase
      .from("project_requests")
      .select("*")
      .eq("id", requestId)
      .single();

  if (!request) {
    throw new Error(
      "Project request not found"
    );
  }

  if (!request.client_id) {
    throw new Error(
      "Create a client account first"
    );
  }

  if (
    request.status ===
    "Converted"
  ) {
    throw new Error(
      "Request already converted"
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
      name: projectName,
      description,

      // Removed because your
      // database expects numeric
      // values while requests
      // contain text ranges.

      status: "IN_PROGRESS",
      progress: 0,

      start_date:
        new Date()
          .toISOString()
          .split("T")[0],

      due_date:
        dueDate || null,
    })
    .select()
    .single();

  if (projectError) {
    throw new Error(
      projectError.message
    );
  }

  const {
    error: requestError,
  } = await supabase
    .from("project_requests")
    .update({
      status: "Converted",
      converted_project_id:
        project.id,
      converted_at:
        new Date().toISOString(),
    })
    .eq("id", requestId);

  if (requestError) {
    throw new Error(
      requestError.message
    );
  }

  revalidatePath(
    "/admin/projects"
  );

  revalidatePath(
    "/admin/project-requests"
  );

  revalidatePath(
    `/admin/project-requests/${requestId}`
  );

  // Save budget range as project note later
  console.log(
    "Budget Range:",
    budget
  );

  redirect(
    `/admin/projects/${project.id}`
  );
}