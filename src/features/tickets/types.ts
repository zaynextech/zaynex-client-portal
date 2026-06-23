export type TicketStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Closed";

export interface Ticket {
  id: string;
  subject: string;
  client: string;
  status: TicketStatus;
  priority: "Low" | "Medium" | "High";
  createdAt: string;
}