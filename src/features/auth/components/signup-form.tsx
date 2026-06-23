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
    "Create Account",

  description:
    "Create your Zaynex Client Portal account.",
};

export default function SignupPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);

      const result = await supabase.auth.signUp({
        email,
        password,
      });

      console.log("FULL RESULT:", result);
      console.log("USER:", result.data?.user);
      console.log("SESSION:", result.data?.session);
      console.log("ERROR:", result.error);

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      if (!result.data?.user) {
        toast.error("User was not created");
        return;
      }

      toast.success("Account created successfully");

      // Development mode
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("SIGNUP CATCH:", error);
      toast.error("Something went wrong");
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
              Create Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join the Zaynex Portal
            </p>
          </div>
        </div>

        {/* INPUT FIELDS SECTION */}
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            className="rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            className="rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="w-full h-10 rounded-xl font-semibold transition-all active:scale-[0.99]"
            disabled={loading}
            onClick={handleSignup}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/auth/login"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              Already have an account? <span className="text-primary font-medium">Sign in</span>
            </Link>
          </div>

          <div className="border-t border-border pt-4 text-center">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}