import { createClient } from "@/lib/supabase/server";

export async function getInvoice(
  invoiceId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      client:profiles!invoices_client_id_fkey(
        id,
        full_name,
        email,
        company_name
      ),
      project:projects!invoices_project_id_fkey(
        id,
        name,
        status,
        progress
      )
    `)
    .eq("id", invoiceId)
    .single();

  if (error) {
    console.error(
      "GET INVOICE ERROR:",
      error
    );

    return null;
  }

  return data;
}