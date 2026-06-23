"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function makeAdmin(
  userId: string
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (
    user?.email !==
    "gkasmiro@gmail.com"
  ) {
    throw new Error(
      "Unauthorized"
    );
  }

  await supabase
    .from("profiles")
    .update({
      role: "ADMIN",
    })
    .eq("id", userId);

  revalidatePath(
    "/admin/admins"
  );
}

export async function removeAdmin(
  userId: string
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (
    user?.email !==
    "gkasmiro@gmail.com"
  ) {
    throw new Error(
      "Unauthorized"
    );
  }

  await supabase
    .from("profiles")
    .update({
      role: "CLIENT",
    })
    .eq("id", userId);

  revalidatePath(
    "/admin/admins"
  );
}