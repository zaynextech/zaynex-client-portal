"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { sendAccountSuspendedEmail } from "@/lib/email/send-account-suspended-email";

export async function freezeClient(
  clientId: string
) {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("profiles")
      .update({
        status: "FROZEN",
      })
      .eq("id", clientId)
      .select(
        "id, email, full_name, status"
      )
      .single();

  if (error) {
    console.error(
      "FREEZE CLIENT ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

  try {
    if (data?.email) {
      await sendAccountSuspendedEmail(
        data.email,
        data.full_name
      );
    }
  } catch (emailError) {
    console.error(
      "SUSPENSION EMAIL ERROR:",
      emailError
    );
  }

  console.log(
    "CLIENT FROZEN:",
    data
  );

  revalidatePath(
    "/admin/clients"
  );

  revalidatePath(
    `/admin/clients/${clientId}`
  );

  revalidatePath(
    "/admin/account-deletion-requests"
  );

  return {
    success: true,
  };
}