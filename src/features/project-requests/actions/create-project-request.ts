"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { createNotification } from "@/lib/notifications/create-notification";
import { sendProjectRequestNotificationEmail } from "@/lib/emails/send-project-request-notification-email";

export async function createProjectRequest(
  formData: FormData
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const companyName =
    String(
      formData.get(
        "company_name"
      ) || ""
    );

  const email = String(
    formData.get("email") || ""
  );

  const phone = String(
    formData.get("phone") || ""
  );

  const projectName =
    String(
      formData.get(
        "project_name"
      ) || ""
    );

  const projectType =
    String(
      formData.get(
        "project_type"
      ) || ""
    );

  const description =
    String(
      formData.get(
        "description"
      ) || ""
    );

  const budgetRange =
    String(
      formData.get(
        "budget_range"
      ) || ""
    );

  const targetLaunchDate =
    String(
      formData.get(
        "target_launch_date"
      ) || ""
    );

  const {
    error,
  } = await supabase
    .from("project_requests")
    .insert({
      client_id:
        user?.id ?? null,

      company_name:
        companyName,

      email,

      phone,

      project_name:
        projectName,

      project_type:
        projectType,

      description,

      budget_range:
        budgetRange,

      target_launch_date:
        targetLaunchDate,
    });

  if (error) {
    console.error(error);

    throw new Error(
      error.message
    );
  }

  const { data: admins } =
    await supabase
      .from("profiles")
      .select("id")
      .eq("role", "ADMIN");

  for (const admin of admins ??
    []) {
    await createNotification({
      userId: admin.id,

      title:
        "New Project Request",

      message: `${companyName} submitted a project request.`,

      href:
        "/admin/project-requests",
    });
  }

  try {
    await sendProjectRequestNotificationEmail(
      {
        companyName,
        email,
        phone,
        projectName,
        projectType,
        budgetRange,
        targetLaunchDate,
        description,
      }
    );
  } catch (
    emailError
  ) {
    console.error(
      "EMAIL ERROR:",
      emailError
    );
  }

  revalidatePath(
    "/admin/project-requests"
  );

  revalidatePath(
    "/admin/notifications"
  );

  redirect(
    "/start-project/success"
  );
}