"use server";

import { revalidatePath } from "next/cache";

import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function deleteClient(
  clientId: string
) {

  const adminSupabase =
    createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

  const { data: profile } =
    await adminSupabase
      .from("profiles")
      .select(
        "id, email, full_name"
      )
      .eq("id", clientId)
      .single();

  if (!profile) {
    throw new Error(
      "Client not found"
    );
  }

  const tables = [
    {
      table: "project_updates",
      column: "created_by",
    },
    {
      table: "project_files",
      column: "uploaded_by",
    },
    {
      table: "ticket_messages",
      column: "sender_id",
    },
    {
      table: "tickets",
      column: "client_id",
    },
    {
      table: "invoices",
      column: "client_id",
    },
    {
      table: "activity_logs",
      column: "user_id",
    },
    {
      table: "projects",
      column: "client_id",
    },
    {
      table: "account_deletion_requests",
      column: "user_id",
    },
  ];

  for (const item of tables) {
    const { error } =
      await adminSupabase
        .from(item.table)
        .delete()
        .eq(
          item.column,
          clientId
        );

    if (error) {
      console.error(
        `DELETE ${item.table} ERROR:`,
        error
      );

      throw new Error(
        `${item.table}: ${error.message}`
      );
    }
  }

  const {
    data: remainingRequests,
  } = await adminSupabase
    .from(
      "account_deletion_requests"
    )
    .select("id")
    .eq("user_id", clientId);

  console.log(
    "Remaining deletion requests:",
    remainingRequests
  );

  const {
    error: profileError,
  } = await adminSupabase
    .from("profiles")
    .delete()
    .eq("id", clientId);

  if (profileError) {
    console.error(
      "PROFILE DELETE ERROR:",
      profileError
    );

    throw new Error(
      profileError.message
    );
  }

  const {
    error: authError,
  } =
    await adminSupabase.auth.admin.deleteUser(
      clientId
    );

  if (authError) {
    console.error(
      "AUTH DELETE ERROR:",
      authError
    );

    throw new Error(
      authError.message
    );
  }

  revalidatePath(
    "/admin/clients"
  );

  revalidatePath(
    "/admin/account-deletion-requests"
  );

  revalidatePath(
    `/admin/clients/${clientId}`
  );

  return {
    success: true,
  };
}