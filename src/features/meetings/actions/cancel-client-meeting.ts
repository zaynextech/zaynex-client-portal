"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function cancelClientMeeting(
  id: string
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

  const { error } =
    await supabase
      .from("meetings")
      .update({
        status:
          "CANCELLED",
      })
      .eq("id", id)
      .eq(
        "email",
        user.email!
      );

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/client/meetings"
  );

  revalidatePath(
    "/admin/meetings"
  );
}