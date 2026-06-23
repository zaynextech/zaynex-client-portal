import LoginForm from "@/features/auth/components/login-form";
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Login",
  description:
    "Access your Zaynex Client Portal account.",
};

export default function LoginPage() {
  return <LoginForm />;
}