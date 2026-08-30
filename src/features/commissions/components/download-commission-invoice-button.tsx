"use client";

import jsPDF from "jspdf";

interface Props {
  commission: {
    id: string;
    projectName: string;
    salespersonName: string;
    budget: number;
    rate: number;
    amount: number;
    status: string;
    paidAt: string | null;
  };
}

export function DownloadCommissionInvoiceButton({
  commission,
}: Props) {
  const downloadInvoice = () => {
    const doc = new jsPDF();

    const invoiceNumber = `COM-${commission.id
      .slice(0, 8)
      .toUpperCase()}`;

    const invoiceDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("ZAYNEX TECHNOLOGIES", 20, 25);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Commission Invoice", 20, 33);

    doc.setFontSize(10);
    doc.text(`Invoice: ${invoiceNumber}`, 140, 25);
    doc.text(`Date: ${invoiceDate}`, 140, 32);

    doc.line(20, 42, 190, 42);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("COMMISSION DETAILS", 20, 55);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text("Salesperson", 20, 70);
    doc.text(commission.salespersonName, 80, 70);

    doc.text("Deal / Company", 20, 82);
    doc.text(commission.projectName, 80, 82);

    doc.text("Project Value", 20, 94);
    doc.text(`$${commission.budget.toLocaleString()}`, 80, 94);

    doc.text("Commission Rate", 20, 106);
    doc.text(`${commission.rate}%`, 80, 106);

    doc.line(20, 115, 190, 115);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Commission Amount", 20, 130);
    doc.text(`$${commission.amount.toLocaleString()}`, 145, 130);

    doc.setFontSize(11);
    doc.text("Status", 20, 145);
    doc.text(commission.status, 80, 145);

    if (commission.paidAt) {
      doc.setFont("helvetica", "normal");
      doc.text("Paid Date", 20, 157);
      doc.text(
        new Date(commission.paidAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        80,
        157
      );
    }

    doc.line(20, 175, 190, 175);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "This invoice represents the salesperson commission for the above deal.",
      20,
      188
    );

    doc.text("Zaynex Technologies", 20, 200);

    doc.save(`${invoiceNumber}.pdf`);
  };

  return (
    <button
      type="button"
      onClick={downloadInvoice}
      className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
    >
      Download Invoice
    </button>
  );
}