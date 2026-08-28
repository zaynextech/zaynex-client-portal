import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface GenerateInvoicePdfProps {
  invoiceNumber: string;
  clientName: string;
  projectName: string;
  amount: number;
  issueDate: string;
  dueDate?: string | null;
  status?: string | null;
  notes?: string | null;
}

export async function generateInvoicePdf({
  invoiceNumber,
  clientName,
  projectName,
  amount,
  issueDate,
  dueDate,
  status,
  notes,
}: GenerateInvoicePdfProps) {
  const pdf = await PDFDocument.create();

  const page = pdf.addPage([595.28, 841.89]);

  // -------------------------------------------------------------
  // FONTS
  // -------------------------------------------------------------

  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // -------------------------------------------------------------
  // COLORS
  // -------------------------------------------------------------

  const textDark = rgb(0.09, 0.09, 0.11);
  const textMuted = rgb(0.44, 0.44, 0.49);
  const cyanBrand = rgb(0.024, 0.714, 0.831);
  const lightBg = rgb(0.97, 0.97, 0.98);
  const borderLine = rgb(0.89, 0.91, 0.94);
  const white = rgb(1, 1, 1);

  // -------------------------------------------------------------
  // STATUS
  // -------------------------------------------------------------
  //
  // Database values:
  // Pending
  // Paid
  // Overdue
  //
  // Normalize everything so Paid / PAID / paid all work.
  // -------------------------------------------------------------

  const normalizedStatus = String(status ?? "")
    .trim()
    .toLowerCase();

  const isPaid = normalizedStatus === "paid";
  const isOverdue = normalizedStatus === "overdue";
  const isPending =
    normalizedStatus === "pending" ||
    normalizedStatus === "unpaid" ||
    normalizedStatus === "";

  let statusLabel = "NOT PAID";
  let statusBg = rgb(0.99, 0.93, 0.93);
  let statusBorder = rgb(0.9, 0.3, 0.3);
  let statusTextColor = rgb(0.78, 0.15, 0.15);

  if (isPaid) {
    statusLabel = "PAID";

    statusBg = rgb(0.92, 0.98, 0.94);
    statusBorder = rgb(0.13, 0.7, 0.38);
    statusTextColor = rgb(0.06, 0.53, 0.28);
  } else if (isOverdue) {
    statusLabel = "OVERDUE";

    statusBg = rgb(0.99, 0.93, 0.93);
    statusBorder = rgb(0.9, 0.3, 0.3);
    statusTextColor = rgb(0.78, 0.15, 0.15);
  } else if (isPending) {
    statusLabel = "NOT PAID";

    statusBg = rgb(1, 0.97, 0.9);
    statusBorder = rgb(0.9, 0.65, 0.15);
    statusTextColor = rgb(0.65, 0.4, 0.05);
  }

  // -------------------------------------------------------------
  // HEADER
  // -------------------------------------------------------------

  const logoX = 50;
  const logoY = 750;

  // Logo
  page.drawRectangle({
    x: logoX,
    y: logoY + 6,
    width: 14,
    height: 14,
    borderWidth: 1.8,
    borderColor: textDark,
    color: white,
  });

  page.drawRectangle({
    x: logoX + 6,
    y: logoY,
    width: 14,
    height: 14,
    borderWidth: 1.8,
    borderColor: cyanBrand,
    color: white,
  });

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

  // Brand
  page.drawText("Zaynex", {
    x: logoX + 26,
    y: logoY + 2,
    size: 18,
    font: fontBold,
    color: textDark,
  });

  page.drawText("support@zaynex.com", {
    x: logoX,
    y: logoY - 22,
    size: 9,
    font: fontRegular,
    color: textMuted,
  });

  page.drawText("www.zaynex.com", {
    x: logoX,
    y: logoY - 35,
    size: 9,
    font: fontRegular,
    color: textMuted,
  });

  // -------------------------------------------------------------
  // INVOICE TITLE
  // -------------------------------------------------------------

  page.drawText("INVOICE", {
    x: 350,
    y: logoY + 2,
    size: 20,
    font: fontBold,
    color: textDark,
  });

  // -------------------------------------------------------------
  // STATUS BADGE
  // -------------------------------------------------------------

  const badgeWidth =
    statusLabel === "OVERDUE"
      ? 78
      : statusLabel === "PAID"
        ? 58
        : 76;

  const badgeHeight = 20;
  const badgeX = 545 - badgeWidth;
  const badgeY = logoY + 2;

  page.drawRectangle({
    x: badgeX,
    y: badgeY,
    width: badgeWidth,
    height: badgeHeight,
    color: statusBg,
    borderColor: statusBorder,
    borderWidth: 1,
  });

  const badgeFontSize = 8.5;

  const textWidth = fontBold.widthOfTextAtSize(
    statusLabel,
    badgeFontSize
  );

  const textX =
    badgeX + (badgeWidth - textWidth) / 2;

  page.drawText(statusLabel, {
    x: textX,
    y: badgeY + 5.5,
    size: badgeFontSize,
    font: fontBold,
    color: statusTextColor,
  });

  // -------------------------------------------------------------
  // INVOICE META
  // -------------------------------------------------------------

  const metaStartY = logoY - 18;
  const metaLabelX = 350;
  const metaValueX = 425;

  // Invoice number
  page.drawText("Invoice #:", {
    x: metaLabelX,
    y: metaStartY,
    size: 9,
    font: fontBold,
    color: textDark,
  });

  page.drawText(invoiceNumber, {
    x: metaValueX,
    y: metaStartY,
    size: 9,
    font: fontRegular,
    color: textMuted,
  });

  // Issue date
  page.drawText("Date:", {
    x: metaLabelX,
    y: metaStartY - 14,
    size: 9,
    font: fontBold,
    color: textDark,
  });

  page.drawText(issueDate || "—", {
    x: metaValueX,
    y: metaStartY - 14,
    size: 9,
    font: fontRegular,
    color: textMuted,
  });

  // Due date
  page.drawText("Due Date:", {
    x: metaLabelX,
    y: metaStartY - 28,
    size: 9,
    font: fontBold,
    color: textDark,
  });

  page.drawText(dueDate || "Upon Receipt", {
    x: metaValueX,
    y: metaStartY - 28,
    size: 9,
    font: fontRegular,
    color: textMuted,
  });

  // -------------------------------------------------------------
  // DIVIDER
  // -------------------------------------------------------------

  page.drawLine({
    start: { x: 50, y: 675 },
    end: { x: 545, y: 675 },
    thickness: 1,
    color: borderLine,
  });

  // -------------------------------------------------------------
  // BILLED TO
  // -------------------------------------------------------------

  page.drawText("BILLED TO", {
    x: 50,
    y: 650,
    size: 9,
    font: fontBold,
    color: textMuted,
  });

  page.drawText(clientName || "Client", {
    x: 50,
    y: 632,
    size: 13,
    font: fontBold,
    color: textDark,
  });

  // -------------------------------------------------------------
  // LINE ITEMS
  // -------------------------------------------------------------

  const tableY = 575;
  const tableWidth = 495;

  // Table header
  page.drawRectangle({
    x: 50,
    y: tableY,
    width: tableWidth,
    height: 24,
    color: textDark,
  });

  page.drawText("Description", {
    x: 62,
    y: tableY + 7,
    size: 9,
    font: fontBold,
    color: white,
  });

  page.drawText("Qty", {
    x: 360,
    y: tableY + 7,
    size: 9,
    font: fontBold,
    color: white,
  });

  page.drawText("Amount", {
    x: 475,
    y: tableY + 7,
    size: 9,
    font: fontBold,
    color: white,
  });

  // Table row
  const rowHeight = 40;
  const rowY = tableY - rowHeight;

  page.drawRectangle({
    x: 50,
    y: rowY,
    width: tableWidth,
    height: rowHeight,
    color: lightBg,
  });

  page.drawLine({
    start: { x: 50, y: rowY },
    end: { x: 545, y: rowY },
    thickness: 1,
    color: borderLine,
  });

  page.drawText(projectName || "Professional Services", {
    x: 62,
    y: rowY + 24,
    size: 9.5,
    font: fontBold,
    color: textDark,
  });

  page.drawText("Professional Services & Deliverables", {
    x: 62,
    y: rowY + 11,
    size: 8,
    font: fontRegular,
    color: textMuted,
  });

  page.drawText("1", {
    x: 365,
    y: rowY + 18,
    size: 9,
    font: fontRegular,
    color: textDark,
  });

  // -------------------------------------------------------------
  // AMOUNT
  // -------------------------------------------------------------

  const numericAmount = Number(amount) || 0;

  const formattedAmount = `$${numericAmount.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;

  page.drawText(formattedAmount, {
    x: 475,
    y: rowY + 18,
    size: 9.5,
    font: fontBold,
    color: textDark,
  });

  // -------------------------------------------------------------
  // FINANCIAL SUMMARY
  // -------------------------------------------------------------

  const summaryY = rowY - 35;
  const summaryLabelX = 360;
  const summaryValueX = 475;

  // Subtotal
  page.drawText("Subtotal:", {
    x: summaryLabelX,
    y: summaryY,
    size: 9.5,
    font: fontRegular,
    color: textMuted,
  });

  page.drawText(formattedAmount, {
    x: summaryValueX,
    y: summaryY,
    size: 9.5,
    font: fontRegular,
    color: textDark,
  });

  page.drawLine({
    start: {
      x: 360,
      y: summaryY - 12,
    },
    end: {
      x: 545,
      y: summaryY - 12,
    },
    thickness: 1,
    color: borderLine,
  });

  // Total
  page.drawText(
    isPaid ? "Total Paid:" : "Total Due:",
    {
      x: summaryLabelX,
      y: summaryY - 28,
      size: 11,
      font: fontBold,
      color: textDark,
    }
  );

  page.drawText(formattedAmount, {
    x: summaryValueX,
    y: summaryY - 28,
    size: 11,
    font: fontBold,
    color: isPaid
      ? rgb(0.06, 0.53, 0.28)
      : cyanBrand,
  });

  // -------------------------------------------------------------
  // NOTES
  // -------------------------------------------------------------

  if (notes) {
    const notesY = summaryY - 80;

    page.drawText("Notes & Payment Terms", {
      x: 50,
      y: notesY,
      size: 9,
      font: fontBold,
      color: textDark,
    });

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

  // -------------------------------------------------------------
  // FOOTER
  // -------------------------------------------------------------

  page.drawLine({
    start: { x: 50, y: 65 },
    end: { x: 545, y: 65 },
    thickness: 0.75,
    color: borderLine,
  });

  let footerText =
    "Thank you for your partnership with Zaynex.";

  if (isPaid) {
    footerText =
      "This invoice has been paid in full. Thank you for your business!";
  } else if (isOverdue) {
    footerText =
      "This invoice is overdue. Please arrange payment at your earliest convenience.";
  }

  page.drawText(footerText, {
    x: 50,
    y: 48,
    size: 8.5,
    font: fontRegular,
    color: textMuted,
  });

  // -------------------------------------------------------------
  // SAVE PDF
  // -------------------------------------------------------------

  return await pdf.save();
}