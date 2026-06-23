"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function updateTimelineStatus(
  timelineId: string,
  projectId: string,
  status: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Update milestone status
  const { error: updateError } =
    await supabase
      .from("project_timeline")
      .update({
        status,
      })
      .eq("id", timelineId);

  if (updateError) {
    throw new Error(
      updateError.message
    );
  }

  // Fetch all milestones
  const { data: milestones, error } =
    await supabase
      .from("project_timeline")
      .select("status")
      .eq("project_id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  const totalMilestones =
    milestones?.length || 0;

  const completedMilestones =
    milestones?.filter(
      (milestone) =>
        milestone.status ===
        "COMPLETED"
    ).length || 0;

  // Auto calculate percentage
  const progress =
    totalMilestones > 0
      ? Math.round(
          (completedMilestones /
            totalMilestones) *
            100
        )
      : 0;

  // Auto determine project status
  let projectStatus =
    "PLANNING";

  if (progress === 100) {
    projectStatus =
      "COMPLETED";
  } else if (progress > 0) {
    projectStatus =
      "IN_PROGRESS";
  }

  // Update project
  const {
    error: projectError,
  } = await supabase
    .from("projects")
    .update({
      progress,
      status: projectStatus,
    })
    .eq("id", projectId);

  if (projectError) {
    throw new Error(
      projectError.message
    );
  }

  revalidatePath(
    `/admin/projects/${projectId}`
  );

  revalidatePath(
    "/admin/projects"
  );

  return {
    success: true,
    progress,
    status: projectStatus,
  };
}