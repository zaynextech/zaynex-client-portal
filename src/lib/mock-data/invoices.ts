import { Invoice } from "@/app/features/invoices/types";

export const invoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    client: "Ahmed Electronics",
    amount: 500,
    status: "Paid",
    dueDate: "2026-06-30",
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    client: "Nile Logistics",
    amount: 1200,
    status: "Pending",
    dueDate: "2026-07-10",
  },
];