"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const SUPER_ADMIN_EMAIL = "gkasmiro@gmail.com";

export type UserRole =
  | "ADMIN"
  | "DEVELOPER"
  | "SELLER"
  | "CLIENT";

async function authorizeSuperAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== SUPER_ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  return supabase;
}

export async function updateUserRole(
  userId: string,
  role: UserRole
) {
  const supabase = await authorizeSuperAdmin();

  // Get target user's email
  const { data: targetUser, error: targetError } =
    await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

  if (targetError) {
    throw new Error(targetError.message);
  }

  // Protect the main administrator
  if (targetUser?.email === SUPER_ADMIN_EMAIL) {
    throw new Error(
      "The Super Admin role cannot be changed."
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      role,
    })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/admins");
}