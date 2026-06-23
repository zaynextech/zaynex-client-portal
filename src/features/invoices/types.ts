export type InvoiceStatus =
  | "Paid"
  | "Pending"
  | "Overdue";

export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
}