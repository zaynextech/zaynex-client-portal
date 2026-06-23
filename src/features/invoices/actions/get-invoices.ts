import { createClient } from "@/lib/supabase/server";

export async function getInvoices() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      client:profiles!invoices_client_id_fkey(
        id,
        full_name,
        email
      ),
      project:projects!invoices_project_id_fkey(
        id,
        name
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "GET INVOICES ERROR:",
      error
    );

    return [];
  }

  return data;
}