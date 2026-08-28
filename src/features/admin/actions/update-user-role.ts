"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const OWNER_EMAIL = "gkasmiro@gmail.com";

export async function updateUserRole(
  userId: string,
  role: "ADMIN" | "DEVELOPER" | "SALES" | "CLIENT"
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only you can change roles
  if (user?.email !== OWNER_EMAIL) {
    throw new Error("Unauthorized");
  }

  // Prevent changing your own role
  if (user.id === userId) {
    throw new Error("You cannot change your own role");
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
  revalidatePath("/admin/clients");
}