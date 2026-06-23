import type { Metadata } from "next";
import StartProjectClient from "./start-project-client";



export const metadata: Metadata = {
  title: "Start Your Project",
  description:
    "Request a website, web application, LMS, online store, or custom solution from Zaynex.",
};

export default function StartProjectPage() {
  return <StartProjectClient />;
}