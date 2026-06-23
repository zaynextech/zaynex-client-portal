import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { generateInvoicePdf } from "@/lib/pdf/generate-invoice-pdf";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  const { id } =
    await params;

  const supabase =
    await createClient();

  const {
    data: invoice,
    error,
  } = await supabase
    .from("invoices")
    .select(`
      *,
      projects (
        name
      ),
      profiles (
        full_name,
        company_name
      )
    `)
    .eq("id", id)
    .single();

  if (error || !invoice) {
    return NextResponse.json(
      {
        error:
          "Invoice not found",
      },
      {
        status: 404,
      }
    );
  }

  const pdfBytes =
    await generateInvoicePdf({
      invoiceNumber:
        invoice.invoice_number,
      clientName:
        invoice.profiles
          ?.company_name ||
        invoice.profiles
          ?.full_name ||
        "Client",
      projectName:
        invoice.projects?.name ||
        "Project",
      amount:
        Number(
          invoice.amount
        ),
      issueDate:
        invoice.issue_date,
      dueDate:
        invoice.due_date,
      notes:
        invoice.notes,
    });

return new Response(
  pdfBytes.buffer as ArrayBuffer,
  {
    headers: {
      "Content-Type":
        "application/pdf",
      "Content-Disposition":
        `attachment; filename="${invoice.invoice_number}.pdf"`,
    },
  }
);
}