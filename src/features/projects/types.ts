export type ProjectStatus =
  | "PLANNING"
  | "IN_PROGRESS"
  | "REVIEW"
  | "COMPLETED"
  | "ON_HOLD"
  | "CANCELLED";

export interface Project {
  id: string;
  client_id: string;

  name: string;
  description: string | null;

  status: ProjectStatus;

  progress: number;

  budget: number | null;

  start_date: string | null;
  due_date: string | null;

  created_at: string;

  client?: {
    id: string;
    full_name: string | null;
    email: string;
  };
}