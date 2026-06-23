"use server";

import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error("Unauthorized");
  }

  const { error } =
    await supabase.auth.resetPasswordForEmail(
      user.email,
      {
        redirectTo:
          `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      }
    );

  if (error) {
    throw error;
  }

  return {
    success: true,
  };
}