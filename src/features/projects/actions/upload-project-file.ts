"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { createNotification } from "@/lib/notifications/create-notification";

export async function uploadProjectFile(
  formData: FormData
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

  const projectId =
    formData.get(
      "projectId"
    ) as string;

  const uploadedByRole =
    (formData.get(
      "uploadedByRole"
    ) as string) || "ADMIN";

  const file = formData.get(
    "file"
  ) as File | null;

  if (!file) {
    throw new Error(
      "No file provided"
    );
  }

  const fileName = `${projectId}/${Date.now()}-${file.name}`;

  const bucketName =
    "project-files";

  const {
    error: uploadError,
  } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      upsert: false,
    });

  if (uploadError) {
    throw new Error(
      uploadError.message
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  const {
    data: project,
  } = await supabase
    .from("projects")
    .select(
      "id,name,client_id"
    )
    .eq("id", projectId)
    .single();

  const { error: dbError } =
    await supabase
      .from("project_files")
      .insert({
        project_id: projectId,
        file_name: file.name,
        file_url: publicUrl,
        file_size: file.size,
        uploaded_by: user.id,
        uploaded_by_role:
          uploadedByRole,
      });

  if (dbError) {
    throw new Error(
      dbError.message
    );
  }

  if (project) {
    // Admin uploaded → notify client
    if (
      uploadedByRole ===
      "ADMIN"
    ) {
      await createNotification({
        userId:
          project.client_id,
        title:
          "New Project File",
        message: `${file.name} was uploaded to ${project.name}.`,
        href: `/client/projects/${project.id}`,
      });
    }

    // Client uploaded → notify admins
    if (
      uploadedByRole ===
      "CLIENT"
    ) {
      const {
        data: admins,
      } = await supabase
        .from("profiles")
        .select("id")
        .eq(
          "role",
          "ADMIN"
        );

      for (const admin of admins ??
        []) {
        await createNotification({
          userId: admin.id,
          title:
            "Client Uploaded File",
          message: `${file.name} was uploaded by a client.`,
          href: `/admin/projects/${project.id}`,
        });
      }
    }
  }

  revalidatePath(
    `/admin/projects/${projectId}`
  );

  revalidatePath(
    `/client/projects/${projectId}`
  );

  revalidatePath(
    "/admin/notifications"
  );

  revalidatePath(
    "/client/notifications"
  );

  return {
    success: true,
  };
}