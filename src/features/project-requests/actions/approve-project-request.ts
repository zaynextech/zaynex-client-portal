// src/features/project-requests/actions/approve-project-request.ts

"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function approveProjectRequest(
  requestId: string
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "Unauthorized"
    );
  }

  const { data: request } =
    await supabase
      .from("project_requests")
      .select(
        "id,status"
      )
      .eq("id", requestId)
      .single();

  if (!request) {
    throw new Error(
      "Project request not found"
    );
  }

  if (
    request.status ===
      "Approved" ||
    request.status ===
      "Converted"
  ) {
    throw new Error(
      "Request has already been processed."
    );
  }

  const { error } =
    await supabase
      .from("project_requests")
      .update({
        status: "Approved",
        reviewed_by: user.id,
        reviewed_at:
          new Date().toISOString(),
      })
      .eq("id", requestId);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/project-requests"
  );

  revalidatePath(
    `/admin/project-requests/${requestId}`
  );
}