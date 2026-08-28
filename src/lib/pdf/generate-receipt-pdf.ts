import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface GenerateReceiptPdfProps {
  invoiceNumber: string;
  clientName: string;
  projectName: string;
  amount: number;
  paidDate: string;
}

export async function generateReceiptPdf({
  invoiceNumber,
  clientName,
  projectName,
  amount,
  paidDate,
}: GenerateReceiptPdfProps) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // Standard A4 Dimensions

  // Embed Fonts
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // Core Palette Matching Design System
  const textDark = rgb(0.09, 0.09, 0.11); // Zinc-900 (#18181B)
  const textMuted = rgb(0.44, 0.44, 0.49); // Zinc-500 (#71717A)
  const cyanBrand = rgb(0.024, 0.714, 0.831); // Cyan-500 (#06B6D4)
  const lightBg = rgb(0.97, 0.97, 0.98); // Light row background (#F8FAFC)
  const borderLine = rgb(0.89, 0.91, 0.94); // Border line (#E2E8F0)
  const white = rgb(1, 1, 1);

  // Emerald Green Paid Theme
  const paidBg = rgb(0.92, 0.98, 0.94);
  const paidBorder = rgb(0.13, 0.7, 0.38);
  const paidText = rgb(0.06, 0.53, 0.28);

  const formattedAmount = `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  // -------------------------------------------------------------
  // HEADER SECTION: LOGO & BRAND
  // -------------------------------------------------------------
  const logoX = 50;
  const logoY = 750;

  // Geometric Wireframe Mark
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

  // Logo Typography
  page.drawText("Zaynex", {
    x: logoX + 26,
    y: logoY + 2,
    size: 18,
    font: fontBold,
    color: textDark,
  });

  page.drawText("support@zaynex.com\nwww.zaynex.com", {
    x: logoX,
    y: logoY - 22,
    size: 9,
    font: fontRegular,
    color: textMuted,
    lineHeight: 13,
  });

  // -------------------------------------------------------------
  // RECEIPT TITLE + PAID BADGE (RIGHT SIDE)
  // -------------------------------------------------------------
  page.drawText("RECEIPT", {
    x: 350,
    y: logoY + 2,
    size: 20,
    font: fontBold,
    color: textDark,
  });

  // Paid Status Badge
  const badgeWidth = 58;
  const badgeHeight = 20;
  const badgeX = 545 - badgeWidth;
  const badgeY = logoY + 2;

  page.drawRectangle({
    x: badgeX,
    y: badgeY,
    width: badgeWidth,
    height: badgeHeight,
    color: paidBg,
    borderColor: paidBorder,
    borderWidth: 1,
  });

  const badgeFontSize = 8.5;
  const badgeLabel = "PAID";
  const textWidth = fontBold.widthOfTextAtSize(badgeLabel, badgeFontSize);
  const textX = badgeX + (badgeWidth - textWidth) / 2;

  page.drawText(badgeLabel, {
    x: textX,
    y: badgeY + 5.5,
    size: badgeFontSize,
    font: fontBold,
    color: paidText,
  });

  // Metadata Fields
  const metaStartY = logoY - 18;
  const metaLabelX = 350;
  const metaValueX = 430;

  // Invoice Reference #
  page.drawText("Invoice Ref:", { x: metaLabelX, y: metaStartY, size: 9, font: fontBold, color: textDark });
  page.drawText(invoiceNumber, { x: metaValueX, y: metaStartY, size: 9, font: fontRegular, color: textMuted });

  // Payment Date
  page.drawText("Payment Date:", { x: metaLabelX, y: metaStartY - 14, size: 9, font: fontBold, color: textDark });
  page.drawText(paidDate, { x: metaValueX, y: metaStartY - 14, size: 9, font: fontRegular, color: textMuted });

  // Payment Status Text
  page.drawText("Status:", { x: metaLabelX, y: metaStartY - 28, size: 9, font: fontBold, color: textDark });
  page.drawText("Settled in Full", { x: metaValueX, y: metaStartY - 28, size: 9, font: fontRegular, color: paidText });

  // Divider Line
  page.drawLine({
    start: { x: 50, y: 675 },
    end: { x: 545, y: 675 },
    thickness: 1,
    color: borderLine,
  });

  // -------------------------------------------------------------
  // RECEIVED FROM SECTION
  // -------------------------------------------------------------
  page.drawText("RECEIVED FROM", {
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
  // PAYMENT BREAKDOWN TABLE
  // -------------------------------------------------------------
  const tableY = 575;
  const tableWidth = 495;

  // Table Header
  page.drawRectangle({
    x: 50,
    y: tableY,
    width: tableWidth,
    height: 24,
    color: textDark,
  });

  page.drawText("Transaction / Project Item", { x: 62, y: tableY + 7, size: 9, font: fontBold, color: white });
  page.drawText("Payment Method", { x: 340, y: tableY + 7, size: 9, font: fontBold, color: white });
  page.drawText("Amount Paid", { x: 460, y: tableY + 7, size: 9, font: fontBold, color: white });

  // Table Row
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

  // Project Details
  page.drawText(projectName, { x: 62, y: rowY + 24, size: 9.5, font: fontBold, color: textDark });
  page.drawText(`Settlement for Invoice #${invoiceNumber}`, { x: 62, y: rowY + 11, size: 8, font: fontRegular, color: textMuted });

  // Payment Status
  page.drawText("Direct / Online", { x: 340, y: rowY + 18, size: 9, font: fontRegular, color: textDark });

  // Amount
  page.drawText(formattedAmount, { x: 460, y: rowY + 18, size: 9.5, font: fontBold, color: textDark });

  // -------------------------------------------------------------
  // FINANCIAL SUMMARY
  // -------------------------------------------------------------
  const summaryY = rowY - 35;
  const summaryLabelX = 350;
  const summaryValueX = 460;

  // Subtotal
  page.drawText("Subtotal Settled:", { x: summaryLabelX, y: summaryY, size: 9.5, font: fontRegular, color: textMuted });
  page.drawText(formattedAmount, { x: summaryValueX, y: summaryY, size: 9.5, font: fontRegular, color: textDark });

  page.drawLine({
    start: { x: 350, y: summaryY - 12 },
    end: { x: 545, y: summaryY - 12 },
    thickness: 1,
    color: borderLine,
  });

  // Total Paid Row
  page.drawText("Total Paid in Full:", {
    x: summaryLabelX,
    y: summaryY - 28,
    size: 11,
    font: fontBold,
    color: textDark,
  });

  page.drawText(formattedAmount, {
    x: summaryValueX,
    y: summaryY - 28,
    size: 11,
    font: fontBold,
    color: paidText,
  });

  // -------------------------------------------------------------
  // CONFIRMATION NOTE BLOCK
  // -------------------------------------------------------------
  const noteBoxY = summaryY - 80;

  page.drawRectangle({
    x: 50,
    y: noteBoxY,
    width: tableWidth,
    height: 32,
    color: lightBg,
    borderColor: borderLine,
    borderWidth: 1,
  });

  page.drawText("Official confirmation of full settlement. No balance remains outstanding for this invoice.", {
    x: 62,
    y: noteBoxY + 11,
    size: 8.5,
    font: fontRegular,
    color: textMuted,
  });

  // -------------------------------------------------------------
  // FOOTER
  // -------------------------------------------------------------
  page.drawLine({
    start: { x: 50, y: 65 },
    end: { x: 545, y: 65 },
    thickness: 0.75,
    color: borderLine,
  });

  page.drawText("Thank you for choosing Zaynex. We appreciate your business!", {
    x: 50,
    y: 48,
    size: 8.5,
    font: fontRegular,
    color: textMuted,
  });

  return await pdf.save();
}