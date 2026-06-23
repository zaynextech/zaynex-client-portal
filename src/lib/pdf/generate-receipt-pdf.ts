import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

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
  const page = pdf.addPage([595, 842]); // Standard A4 Dimensions

  // 1. Core Typography Fonts
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // 2. Premium Corporate Color Palette (Emerald Accent for Receipts)
  const primaryColor = rgb(0.118, 0.161, 0.231);    // Slate 800 (#1E293B)
  const secondaryColor = rgb(0.278, 0.333, 0.412);  // Slate 600 (#475569)
  const accentPaidColor = rgb(0.059, 0.463, 0.431); // Emerald 700 (#0F766E)
  const lightBgColor = rgb(0.961, 0.969, 0.98);     // Shading background gray (#F5F7FA)
  const borderLineColor = rgb(0.88, 0.89, 0.92);    // Subtle dividing line accent

  // --- BRAND HEADER SECTION ---
  page.drawText("ZAYNEX", {
    x: 50,
    y: 760,
    size: 26,
    font: fontBold,
    color: primaryColor,
  });

  page.drawText("billing@zaynex.com\nwww.zaynex.com", {
    x: 50,
    y: 730,
    size: 9,
    font: fontRegular,
    color: secondaryColor,
    lineHeight: 12,
  });

  // --- RECEIPT META BLOCK (RIGHT ALIGNED) ---
  page.drawText("PAYMENT RECEIPT", {
    x: 360,
    y: 760,
    size: 22,
    font: fontBold,
    color: primaryColor,
  });

  const detailsY = 730;
  page.drawText("Receipt Target:", { x: 390, y: detailsY, size: 10, font: fontBold, color: primaryColor });
  page.drawText(`INV-${invoiceNumber}`, { x: 475, y: detailsY, size: 10, font: fontRegular, color: secondaryColor });

  page.drawText("Payment Date:", { x: 390, y: detailsY - 15, size: 10, font: fontBold, color: primaryColor });
  page.drawText(paidDate, { x: 475, y: detailsY - 15, size: 10, font: fontRegular, color: secondaryColor });

  // Divider Line separating header from client data
  page.drawLine({
    start: { x: 50, y: 670 },
    end: { x: 545, y: 670 },
    thickness: 1,
    color: borderLineColor,
  });

  // --- CLIENT INFORMATION & PAID BADGE ---
  page.drawText("RECEIVED FROM", {
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

  // Status Accent Badge: "PAID"
  page.drawRectangle({
    x: 460,
    y: 622,
    width: 85,
    height: 24,
    color: rgb(0.804, 0.953, 0.933), // Emerald 100 soft green tint
  });
  page.drawText("STATUS: PAID", {
    x: 471,
    y: 630,
    size: 9,
    font: fontBold,
    color: accentPaidColor,
  });

  // --- LEDGER STATEMENT TABLE ---
  const tableY = 540;

  // Solid Table Grid Header Container
  page.drawRectangle({
    x: 50,
    y: tableY,
    width: 495,
    height: 25,
    color: primaryColor,
  });

  // Column Labels
  page.drawText("Transaction/Project Reference", { x: 60, y: tableY + 7, size: 10, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Paid Status", { x: 340, y: tableY + 7, size: 10, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Amount", { x: 485, y: tableY + 7, size: 10, font: fontBold, color: rgb(1, 1, 1) });

  // Alternating Row Shaded block
  page.drawRectangle({
    x: 50,
    y: tableY - 35,
    width: 495,
    height: 35,
    color: lightBgColor,
  });

  // Project Details Insertion
  page.drawText(projectName, { x: 60, y: tableY - 20, size: 10, font: fontBold, color: primaryColor });
  page.drawText(`Settlement for Invoice #${invoiceNumber}`, { x: 60, y: tableY - 30, size: 8, font: fontRegular, color: secondaryColor });
  
  // Grid values
  page.drawText("Success", { x: 340, y: tableY - 20, size: 10, font: fontRegular, color: accentPaidColor });
  page.drawText(`$${amount.toFixed(2)}`, { x: 485, y: tableY - 20, size: 10, font: fontRegular, color: primaryColor });

  // --- LEDGER TOTALS CLOSURE ---
  const summaryY = tableY - 80;

  page.drawText("Total Amount Paid:", { x: 360, y: summaryY, size: 11, font: fontBold, color: primaryColor });
  page.drawText(`$${amount.toFixed(2)}`, { x: 485, y: summaryY, size: 11, font: fontBold, color: accentPaidColor });

  // Sub-confirmation note box
  page.drawRectangle({
    x: 50,
    y: summaryY - 60,
    width: 495,
    height: 30,
    color: lightBgColor,
  });

  page.drawText("Payment received successfully. Thank you for your prompt transaction.", {
    x: 60,
    y: summaryY - 49,
    size: 9.5,
    font: fontRegular,
    color: secondaryColor,
  });

  // --- FOOTER SECTION ---
  page.drawText("Thank you for choosing Zaynex. We value your partnership.", {
    x: 50,
    y: 50,
    size: 9,
    font: fontRegular,
    color: secondaryColor,
  });

  return await pdf.save();
}