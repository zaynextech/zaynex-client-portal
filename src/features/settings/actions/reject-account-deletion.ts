"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { sendAccountDeletionRejectedEmail } from "@/lib/email/send-account-deletion-rejected-email";
import { createNotification } from "@/lib/notifications/create-notification";

export async function rejectAccountDeletion(
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
      .from(
        "account_deletion_requests"
      )
      .select(`
        *,
        profiles!account_deletion_requests_user_id_fkey (
          id,
          email,
          full_name
        )
      `)
      .eq("id", requestId)
      .single();

  if (!request) {
    throw new Error(
      "Request not found"
    );
  }

  const { error } =
    await supabase
      .from(
        "account_deletion_requests"
      )
      .update({
        status: "Rejected",
        reviewed_at:
          new Date().toISOString(),
        reviewed_by:
          user.id,
      })
      .eq("id", requestId);

  if (error) {
    throw new Error(
      error.message
    );
  }

  const profile =
    request.profiles as {
      id: string;
      email: string;
      full_name: string | null;
    } | null;

  try {
    if (profile?.email) {
      await sendAccountDeletionRejectedEmail(
        profile.email,
        profile.full_name
      );
    }
  } catch (
    emailError
  ) {
    console.error(
      "REJECTION EMAIL ERROR:",
      emailError
    );
  }

  try {
    if (profile?.id) {
      await createNotification({
        userId:
          profile.id,
        title:
          "Deletion Request Rejected",
        message:
          "Your account deletion request has been rejected by the Zaynex team.",
        href:
          "/client/settings",
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
    "/admin/account-deletion-requests"
  );

  revalidatePath(
    "/admin/notifications"
  );

  revalidatePath(
    "/client/settings"
  );

  revalidatePath(
    "/client/notifications"
  );

  return {
    success: true,
  };
}