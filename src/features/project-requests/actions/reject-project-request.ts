// src/features/project-requests/actions/reject-project-request.ts

"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function rejectProjectRequest(
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
      .select(`
        id,
        email,
        company_name,
        project_name
      `)
      .eq("id", requestId)
      .single();

  if (!request) {
    throw new Error(
      "Project request not found"
    );
  }

  const { error } =
    await supabase
      .from("project_requests")
      .update({
        status: "Rejected",
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

  // Optional:
  // await sendProjectRequestRejectedEmail(
  //   request.email,
  //   request.company_name,
  //   request.project_name
  // );

  revalidatePath(
    "/admin/project-requests"
  );

  revalidatePath(
    `/admin/project-requests/${requestId}`
  );

  return {
    success: true,
  };
}