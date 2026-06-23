"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { sendAccountDeletionApprovedEmail } from "@/lib/email/send-account-deletion-approved-email";

export async function approveAccountDeletion(
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
          email,
          full_name
        )
      `)
      .eq("id", requestId)
      .single();

  const { error } =
    await supabase
      .from(
        "account_deletion_requests"
      )
      .update({
        status: "Approved",
        reviewed_at:
          new Date().toISOString(),
        reviewed_by: user.id,
      })
      .eq("id", requestId);

  if (error) {
    throw new Error(
      error.message
    );
  }

  try {
    const profile =
      request?.profiles as {
        email: string;
        full_name: string | null;
      } | null;

    if (profile?.email) {
      await sendAccountDeletionApprovedEmail(
        profile.email,
        profile.full_name
      );
    }
  } catch (emailError) {
    console.error(
      "APPROVAL EMAIL ERROR:",
      emailError
    );
  }

  revalidatePath(
    "/admin/account-deletion-requests"
  );

  revalidatePath(
    "/client/settings"
  );

  return {
    success: true,
  };
}