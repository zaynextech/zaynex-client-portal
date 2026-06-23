import { Project } from "@/features/projects/types";

export const projects: Project[] = [
  {
    id: "1",
    name: "E-Commerce Website",
    client: "Ahmed Electronics",

    status: "Development",
    progress: 75,

    startDate: "2026-06-01",
    dueDate: "2026-07-15",

    description:
      "Modern e-commerce platform with payment integration and admin dashboard.",
  },
  {
    id: "2",
    name: "Corporate Website",
    client: "Nile Logistics",

    status: "Testing",
    progress: 90,

    startDate: "2026-05-20",
    dueDate: "2026-06-30",

    description:
      "Professional corporate website with CMS integration.",
  },
];