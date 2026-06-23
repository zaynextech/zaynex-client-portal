import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

interface GenerateInvoicePdfProps {
  invoiceNumber: string;
  clientName: string;
  projectName: string;
  amount: number;
  issueDate: string;
  dueDate?: string | null;
  notes?: string | null;
}

export async function generateInvoicePdf({
  invoiceNumber,
  clientName,
  projectName,
  amount,
  issueDate,
  dueDate,
  notes,
}: GenerateInvoicePdfProps) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4 dimensions

  // 1. Embed Fonts
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // 2. Color Palette Definitions
  const primaryColor = rgb(0.118, 0.161, 0.231); // Slate 800 (#1E293B)
  const secondaryColor = rgb(0.278, 0.333, 0.412); // Slate 600 (#475569)
  const lightBgColor = rgb(0.961, 0.969, 0.98); // Light gray (#F5F7FA)
  const borderLineColor = rgb(0.88, 0.89, 0.92);

  // --- HEADER SECTION ---
  // Company Logo / Brand Name
  page.drawText("ZAYNEX", {
    x: 50,
    y: 760,
    size: 26,
    font: fontBold,
    color: primaryColor,
  });

  page.drawText("info@zaynex.com\nwww.zaynex.com", {
    x: 50,
    y: 730,
    size: 9,
    font: fontRegular,
    color: secondaryColor,
    lineHeight: 12,
  });

  // Invoice Meta Title (Right Aligned Concept)
  page.drawText("INVOICE", {
    x: 430,
    y: 760,
    size: 26,
    font: fontBold,
    color: primaryColor,
  });

  // Invoice details box (Right side)
  const detailsY = 730;
  page.drawText(`Invoice #:`, { x: 430, y: detailsY, size: 10, font: fontBold, color: primaryColor });
  page.drawText(invoiceNumber, { x: 500, y: detailsY, size: 10, font: fontRegular, color: secondaryColor });

  page.drawText(`Date:`, { x: 430, y: detailsY - 15, size: 10, font: fontBold, color: primaryColor });
  page.drawText(issueDate, { x: 500, y: detailsY - 15, size: 10, font: fontRegular, color: secondaryColor });

  page.drawText(`Due Date:`, { x: 430, y: detailsY - 30, size: 10, font: fontBold, color: primaryColor });
  page.drawText(dueDate || "Upon Receipt", { x: 500, y: detailsY - 30, size: 10, font: fontRegular, color: secondaryColor });

  // Divider Line
  page.drawLine({
    start: { x: 50, y: 670 },
    end: { x: 545, y: 670 },
    thickness: 1,
    color: borderLineColor,
  });

  // --- BILL TO SECTION ---
  page.drawText("BILL TO", {
    x: 50,
    y: 645,
    size: 10,
    font: fontBold,
    color: secondaryColor,
  });

  page.drawText(clientName, {
    x: 50,
    y: 625,
    size: 14,
    font: fontBold,
    color: primaryColor,
  });

  // --- LINE ITEMS TABLE ---
  const tableY = 560;

  // Table Header Background
  page.drawRectangle({
    x: 50,
    y: tableY,
    width: 495,
    height: 25,
    color: primaryColor,
  });

  // Table Headers text
  page.drawText("Description", { x: 60, y: tableY + 7, size: 10, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Quantity", { x: 340, y: tableY + 7, size: 10, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Total Price", { x: 475, y: tableY + 7, size: 10, font: fontBold, color: rgb(1, 1, 1) });

  // Row 1 Data (Shaded background for table entry)
  page.drawRectangle({
    x: 50,
    y: tableY - 35,
    width: 495,
    height: 35,
    color: lightBgColor,
  });

  // Project item description
  page.drawText(projectName, { x: 60, y: tableY - 22, size: 10, font: fontBold, color: primaryColor });
  page.drawText("Professional Services Rendered", { x: 60, y: tableY - 32, size: 8, font: fontRegular, color: secondaryColor });
  
  // Qty
  page.drawText("1", { x: 355, y: tableY - 22, size: 10, font: fontRegular, color: primaryColor });
  
  // Total (Right justified matching Header position)
  const dynamicAmountStr = `$${amount.toFixed(2)}`;
  page.drawText(dynamicAmountStr, { x: 475, y: tableY - 22, size: 10, font: fontRegular, color: primaryColor });

  // --- FINANCIAL SUMMARY ---
  const summaryY = tableY - 80;
  
  // Calculations
  const taxRate = 0.10; // 10% example corporate tax rate
  const taxAmount = amount * taxRate;
  const grandTotal = amount + taxAmount;

  // Subtotal Row
  page.drawText("Subtotal:", { x: 390, y: summaryY, size: 10, font: fontRegular, color: secondaryColor });
  page.drawText(`$${amount.toFixed(2)}`, { x: 475, y: summaryY, size: 10, font: fontRegular, color: primaryColor });

  // Tax Row
  page.drawText("Tax (10%):", { x: 390, y: summaryY - 20, size: 10, font: fontRegular, color: secondaryColor });
  page.drawText(`$${taxAmount.toFixed(2)}`, { x: 475, y: summaryY - 20, size: 10, font: fontRegular, color: primaryColor });

  // Divider for Total
  page.drawLine({
    start: { x: 390, y: summaryY - 30 },
    end: { x: 545, y: summaryY - 30 },
    thickness: 1,
    color: borderLineColor,
  });

  // Balance Due Row
  page.drawText("Total Due:", { x: 390, y: summaryY - 48, size: 12, font: fontBold, color: primaryColor });
  page.drawText(`$${grandTotal.toFixed(2)}`, { x: 475, y: summaryY - 48, size: 12, font: fontBold, color: primaryColor });

  // --- NOTES & FOOTER ---
  if (notes) {
    const notesY = summaryY - 110;
    page.drawText("Notes & Payment Instructions", { x: 50, y: notesY, size: 10, font: fontBold, color: primaryColor });
    page.drawText(notes, {
      x: 50,
      y: notesY - 15,
      size: 9,
      font: fontRegular,
      color: secondaryColor,
      maxWidth: 300,
      lineHeight: 13,
    });
  }

  // Sticky Footer
  page.drawText("Thank you for choosing Zaynex. We appreciate your business!", {
    x: 50,
    y: 50,
    size: 9,
    font: fontRegular,
    color: secondaryColor,
  });

  return await pdf.save();
}