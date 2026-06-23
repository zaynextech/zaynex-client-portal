"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
  import { redirect } from "next/navigation";
import { sendProjectRequestNotificationEmail } from "@/lib/emails/send-project-request-notification-email";
export async function createProjectRequestInClient(
  formData: FormData
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } =
    await supabase
      .from("project_requests")
      .insert({
        client_id:
          user?.id ?? null,

        company_name:
          formData.get("company_name"),

        email:
          formData.get("email"),

        phone:
          formData.get("phone"),

        project_name:
          formData.get("project_name"),

        project_type:
          formData.get("project_type"),

        description:
          formData.get("description"),

        budget_range:
          formData.get("budget_range"),

        target_launch_date:
          formData.get("target_launch_date"),
      });

  if (error) {
    console.error(error);
    throw new Error(
      error.message
    );
  }
  
await sendProjectRequestNotificationEmail({
  companyName:
    String(
      formData.get(
        "company_name"
      )
    ),
  email: String(
    formData.get("email")
  ),
  phone: String(
    formData.get("phone") ||
      ""
  ),
  projectName: String(
    formData.get(
      "project_name"
    )
  ),
  projectType: String(
    formData.get(
      "project_type"
    )
  ),
  budgetRange: String(
    formData.get(
      "budget_range"
    ) || ""
  ),
  targetLaunchDate:
    String(
      formData.get(
        "target_launch_date"
      ) || ""
    ),
  description: String(
    formData.get(
      "description"
    )
  ),
});


revalidatePath(
  "/admin/project-requests"
);

redirect(
  "/start-project/success"
);
}