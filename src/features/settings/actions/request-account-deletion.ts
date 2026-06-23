"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { sendAccountDeletionRequestEmail } from "@/lib/email/send-account-deletion-request-email";
import { createNotification } from "@/lib/notifications/create-notification";

export async function requestAccountDeletion() {
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

  const { data: profile } =
    await supabase
      .from("profiles")
      .select(
        "email, full_name"
      )
      .eq("id", user.id)
      .single();

  const { data: existing } =
    await supabase
      .from(
        "account_deletion_requests"
      )
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "Pending")
      .maybeSingle();

  if (existing) {
    throw new Error(
      "You already have a pending request."
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from(
      "account_deletion_requests"
    )
    .insert({
      user_id: user.id,
      status: "Pending",
    })
    .select()
    .single();

  if (error) {
    console.error(
      "ACCOUNT DELETION REQUEST ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

  try {
    if (profile?.email) {
      await sendAccountDeletionRequestEmail(
        profile.email,
        profile.full_name
      );
    }
  } catch (
    emailError
  ) {
    console.error(
      "ACCOUNT DELETION EMAIL ERROR:",
      emailError
    );
  }

  try {
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
          "Account Deletion Request",
        message: `${
          profile?.full_name ||
          profile?.email ||
          "A user"
        } requested account deletion.`,
        href:
          "/admin/account-deletion-requests",
      });
    }
  } catch (
    notificationError
  ) {
    console.error(
      "NOTIFICATION ERROR:",
      notificationError
    );
  }

  revalidatePath(
    "/client/settings"
  );

  revalidatePath(
    "/admin/account-deletion-requests"
  );

  revalidatePath(
    "/admin/notifications"
  );

  return data;
}