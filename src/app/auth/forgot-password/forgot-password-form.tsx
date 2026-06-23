"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/Logo";

import { createClient } from "@/lib/supabase/client";

export const metadata = {
  title:
    "Forgot Password",

  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        throw error;
      }

      toast.success("Password reset email sent. Check your inbox.");
      setEmail("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-background text-foreground transition-colors duration-200">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        
        {/* LOGO AND HEADER WRAPPER */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Logo isFolded={false} />
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Forgot Password
            </h1>
            <p className="text-sm text-muted-foreground max-w-70 sm:max-w-none">
              Enter your email address and we&apos;ll send you a password reset link.
            </p>
          </div>
        </div>

        {/* INPUT FORM BLOCK */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium pl-0.5 text-foreground">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              className="rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10 rounded-xl font-semibold transition-all active:scale-[0.99]"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        {/* RECOVERY NAV PATH */}
        <div className="text-center pt-2">
          <Link
            href="/auth/login"
            className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}