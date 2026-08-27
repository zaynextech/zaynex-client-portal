import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

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
  const page = pdf.addPage([595.28, 841.89]); // Standard A4 Dimensions

  // Embed Helvetica fonts
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // Theme Colors
  const textDark = rgb(0.09, 0.09, 0.11); // Zinc-900 (#18181B)
  const textMuted = rgb(0.44, 0.44, 0.49); // Zinc-500 (#71717A)
  const cyanBrand = rgb(0.024, 0.714, 0.831); // Cyan-500 (#06B6D4)
  const lightBg = rgb(0.97, 0.97, 0.98); // Light gray row background (#F8FAFC)
  const borderLine = rgb(0.89, 0.91, 0.94); // Border separator (#E2E8F0)
  const white = rgb(1, 1, 1);

  // -------------------------------------------------------------
  // HEADER SECTION: LOGO + COMPANY INFO
  // -------------------------------------------------------------
  const logoX = 50;
  const logoY = 750;

  // 1. Draw Geometric Wireframe Mark (Matching Logo.tsx)
  // Top-left dark square
  page.drawRectangle({
    x: logoX,
    y: logoY + 6,
    width: 14,
    height: 14,
    borderWidth: 1.8,
    borderColor: textDark,
    color: white,
  });

  // Bottom-right cyan square (overlapping)
  page.drawRectangle({
    x: logoX + 6,
    y: logoY,
    width: 14,
    height: 14,
    borderWidth: 1.8,
    borderColor: cyanBrand,
    color: white,
  });

  // Re-draw overlapping lines for depth
  page.drawRectangle({
    x: logoX,
    y: logoY + 6,
    width: 14,
    height: 14,
    borderWidth: 1.8,
    borderColor: textDark,
    borderOpacity: 1,
    opacity: 0,
  });

  // 2. Logo Typography "Zaynex"
  page.drawText("Zaynex", {
    x: logoX + 26,
    y: logoY + 2,
    size: 18,
    font: fontBold,
    color: textDark,
  });

  // Company contact details
  page.drawText("support@zaynex.com\nwww.zaynex.com", {
    x: logoX,
    y: logoY - 22,
    size: 9,
    font: fontRegular,
    color: textMuted,
    lineHeight: 13,
  });

  // -------------------------------------------------------------
  // INVOICE META (RIGHT-ALIGNED)
  // -------------------------------------------------------------
  page.drawText("INVOICE", {
    x: 410,
    y: logoY + 2,
    size: 20,
    font: fontBold,
    color: textDark,
  });

  const metaStartY = logoY - 20;
  const metaLabelX = 410;
  const metaValueX = 480;

  // Invoice #
  page.drawText("Invoice #:", { x: metaLabelX, y: metaStartY, size: 9, font: fontBold, color: textDark });
  page.drawText(invoiceNumber, { x: metaValueX, y: metaStartY, size: 9, font: fontRegular, color: textMuted });

  // Issue Date
  page.drawText("Date:", { x: metaLabelX, y: metaStartY - 14, size: 9, font: fontBold, color: textDark });
  page.drawText(issueDate, { x: metaValueX, y: metaStartY - 14, size: 9, font: fontRegular, color: textMuted });

  // Due Date
  page.drawText("Due Date:", { x: metaLabelX, y: metaStartY - 28, size: 9, font: fontBold, color: textDark });
  page.drawText(dueDate || "Upon Receipt", { x: metaValueX, y: metaStartY - 28, size: 9, font: fontRegular, color: textMuted });

  // Divider Line
  page.drawLine({
    start: { x: 50, y: 675 },
    end: { x: 545, y: 675 },
    thickness: 1,
    color: borderLine,
  });

  // -------------------------------------------------------------
  // BILL TO SECTION
  // -------------------------------------------------------------
  page.drawText("BILLED TO", {
    x: 50,
    y: 650,
    size: 9,
    font: fontBold,
    color: textMuted,
  });

  page.drawText(clientName, {
    x: 50,
    y: 632,
    size: 13,
    font: fontBold,
    color: textDark,
  });

  // -------------------------------------------------------------
  // LINE ITEMS TABLE
  // -------------------------------------------------------------
  const tableY = 575;
  const tableWidth = 495;

  // Table Header Box
  page.drawRectangle({
    x: 50,
    y: tableY,
    width: tableWidth,
    height: 24,
    color: textDark,
  });

  // Table Column Labels
  page.drawText("Description", { x: 62, y: tableY + 7, size: 9, font: fontBold, color: white });
  page.drawText("Qty", { x: 360, y: tableY + 7, size: 9, font: fontBold, color: white });
  page.drawText("Amount", { x: 475, y: tableY + 7, size: 9, font: fontBold, color: white });

  // Item Row Box
  const rowHeight = 40;
  const rowY = tableY - rowHeight;

  page.drawRectangle({
    x: 50,
    y: rowY,
    width: tableWidth,
    height: rowHeight,
    color: lightBg,
  });

  // Row Separator Border
  page.drawLine({
    start: { x: 50, y: rowY },
    end: { x: 545, y: rowY },
    thickness: 1,
    color: borderLine,
  });

  // Item Details
  page.drawText(projectName, { x: 62, y: rowY + 24, size: 9.5, font: fontBold, color: textDark });
  page.drawText("Professional Services & Deliverables", { x: 62, y: rowY + 11, size: 8, font: fontRegular, color: textMuted });

  // Qty
  page.drawText("1", { x: 365, y: rowY + 18, size: 9, font: fontRegular, color: textDark });

  // Total
  const formattedAmount = `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  page.drawText(formattedAmount, { x: 475, y: rowY + 18, size: 9.5, font: fontBold, color: textDark });

  // -------------------------------------------------------------
  // FINANCIAL SUMMARY (SUBTOTAL & TOTAL)
  // -------------------------------------------------------------
  const summaryY = rowY - 35;
  const summaryLabelX = 370;
  const summaryValueX = 475;

  // Subtotal
  page.drawText("Subtotal:", { x: summaryLabelX, y: summaryY, size: 9.5, font: fontRegular, color: textMuted });
  page.drawText(formattedAmount, { x: summaryValueX, y: summaryY, size: 9.5, font: fontRegular, color: textDark });

  // Divider Line
  page.drawLine({
    start: { x: 370, y: summaryY - 12 },
    end: { x: 545, y: summaryY - 12 },
    thickness: 1,
    color: borderLine,
  });

  // Total Due
  page.drawText("Total Due:", { x: summaryLabelX, y: summaryY - 28, size: 11, font: fontBold, color: textDark });
  page.drawText(formattedAmount, { x: summaryValueX, y: summaryY - 28, size: 11, font: fontBold, color: cyanBrand });

  // -------------------------------------------------------------
  // NOTES & FOOTER
  // -------------------------------------------------------------
  if (notes) {
    const notesY = summaryY - 80;
    page.drawText("Notes & Payment Terms", { x: 50, y: notesY, size: 9, font: fontBold, color: textDark });
    page.drawText(notes, {
      x: 50,
      y: notesY - 15,
      size: 8.5,
      font: fontRegular,
      color: textMuted,
      maxWidth: 320,
      lineHeight: 12,
    });
  }

  // Footer Line
  page.drawLine({
    start: { x: 50, y: 65 },
    end: { x: 545, y: 65 },
    thickness: 0.75,
    color: borderLine,
  });

  page.drawText("Thank you for your partnership with Zaynex.", {
    x: 50,
    y: 48,
    size: 8.5,
    font: fontRegular,
    color: textMuted,
  });

  return await pdf.save();
}