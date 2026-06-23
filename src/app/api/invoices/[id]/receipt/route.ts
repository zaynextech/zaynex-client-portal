import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { generateReceiptPdf } from "@/lib/pdf/generate-receipt-pdf";

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

  if (
    invoice.status !==
    "PAID"
  ) {
    return NextResponse.json(
      {
        error:
          "Receipt available only for paid invoices",
      },
      {
        status: 400,
      }
    );
  }

  const pdfBytes =
    await generateReceiptPdf({
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
      paidDate:
        invoice.updated_at,
    });

const buffer =
  Buffer.from(pdfBytes);

return new Response(
  buffer,
  {
    headers: {
      "Content-Type":
        "application/pdf",
      "Content-Disposition":
        `attachment; filename="Receipt-${invoice.invoice_number}.pdf"`,
    },
  }
);
}