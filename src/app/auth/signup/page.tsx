import SignupForm from "@/features/auth/components/signup-form";
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create your Zaynex Client Portal account.",
};

export default function SignupPage() {
  return <SignupForm />;
}