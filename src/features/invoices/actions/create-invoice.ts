"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { createNotification } from "@/lib/notifications/create-notification";

interface CreateInvoiceInput {
  project_id: string;
  client_id: string;
  amount: number;
  due_date?: string;
  notes?: string;
}

export async function createInvoice(
  data: CreateInvoiceInput
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

  const invoiceNumber = `INV-${Date.now()}`;

  const {
    data: invoice,
    error,
  } = await supabase
    .from("invoices")
    .insert({
      invoice_number:
        invoiceNumber,
      project_id:
        data.project_id,
      client_id:
        data.client_id,
      amount: data.amount,
      status: "Pending",
      issue_date:
        new Date()
          .toISOString()
          .split("T")[0],
      due_date:
        data.due_date ||
        null,
      notes:
        data.notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error(
      "CREATE INVOICE ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

  try {
    await createNotification({
      userId:
        data.client_id,
      title:
        "New Invoice",
      message: `Invoice ${invoiceNumber} has been created for your project.`,
      href:
        invoice?.id
          ? `/client/invoices/${invoice.id}`
          : "/client/invoices",
    });
  } catch (
    notificationError
  ) {
    console.error(
      "NOTIFICATION ERROR:",
      notificationError
    );
  }

  revalidatePath(
    "/admin/invoices"
  );

  revalidatePath(
    "/client/invoices"
  );

  revalidatePath(
    "/client/notifications"
  );

  return invoice;
}