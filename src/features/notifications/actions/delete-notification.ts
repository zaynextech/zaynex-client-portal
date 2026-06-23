"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function deleteNotification(
  notificationId: string
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

  const { error } =
    await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", user.id);

  if (error) {
    throw new Error(
      error.message
    );
  }

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