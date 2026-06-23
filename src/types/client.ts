export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  projects: number;
  status: "Active" | "Inactive";
}