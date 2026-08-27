"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type InvoiceStatus =
  | "Pending"
  | "Paid"
  | "Overdue";

export async function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("invoices")
    .update({
      status,
    })
    .eq("id", invoiceId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/invoices");
}