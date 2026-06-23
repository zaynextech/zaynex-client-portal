"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { sendAccountUnsuspendedEmail } from "@/lib/email/send-account-unsuspended-email";

export async function unfreezeClient(
  clientId: string
) {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("profiles")
      .update({
        status: "ACTIVE",
      })
      .eq("id", clientId)
      .select(
        "id, email, full_name, status"
      )
      .single();

  if (error) {
    console.error(
      "UNFREEZE CLIENT ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

  try {
    if (data?.email) {
      await sendAccountUnsuspendedEmail(
        data.email,
        data.full_name
      );
    }
  } catch (emailError) {
    console.error(
      "RESTORE EMAIL ERROR:",
      emailError
    );
  }

  revalidatePath(
    "/admin/clients"
  );

  revalidatePath(
    `/admin/clients/${clientId}`
  );

  return {
    success: true,
  };
}