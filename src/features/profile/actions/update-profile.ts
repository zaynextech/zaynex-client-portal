"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

interface UpdateProfileInput {
  full_name: string;
  company_name?: string;
  phone?: string;
}

export async function updateProfile(
  data: UpdateProfileInput
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const fullName =
    data.full_name.trim();

  const companyName =
    data.company_name?.trim();

  const phone =
    data.phone?.trim();

  if (!fullName) {
    throw new Error(
      "Full name is required"
    );
  }

  const { error } =
    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        company_name:
          companyName || null,
        phone: phone || null,
      })
      .eq("id", user.id);

  if (error) {
    console.error(
      "UPDATE PROFILE ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/client/profile"
  );

  revalidatePath(
    "/admin/profile"
  );

  return {
    success: true,
    message:
      "Profile updated successfully",
  };
}