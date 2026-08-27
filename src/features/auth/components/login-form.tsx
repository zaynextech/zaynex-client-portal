"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/Logo"; // Adjust path if necessary
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        toast.error("Profile not found");
        return;
      }

      toast.success("Login successful");

      if (profile.role === "ADMIN") {
        window.location.href = "/admin";
        return;
      }

      if (profile.role === "CLIENT") {
        window.location.href = "/client";
        return;
      }

      toast.error("Invalid user role");
    } catch (error) {
      console.error(error);
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
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account
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

          {/* PASSWORD FIELD WITH TOGGLE EYE */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="rounded-xl pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* REMEMBER ME & FORGOT PASSWORD */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <Link
              href="/auth/forgot-password"
              className="font-medium text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            className="w-full h-10 rounded-xl font-semibold transition-all active:scale-[0.99]"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/auth/signup"
              className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              Don&apos;t have an account? <span className="text-primary font-medium">Sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}