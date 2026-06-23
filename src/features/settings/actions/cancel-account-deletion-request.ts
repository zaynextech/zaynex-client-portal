"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function cancelAccountDeletionRequest() {
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
      .from(
        "account_deletion_requests"
      )
      .delete()
      .eq("user_id", user.id)
      .eq("status", "Pending");

  if (error) {
    console.error(
      "CANCEL ACCOUNT DELETION ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/client/settings"
  );

  revalidatePath(
    "/admin/account-deletion-requests"
  );

  return {
    success: true,
  };
}