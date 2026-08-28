"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";


export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data.user) {
        toast.error("User account not found");
        return;
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

      if (profileError || !profile) {
        toast.error("Profile not found");
        return;
      }


toast.success("Login successful");

switch (profile.role?.toUpperCase()) {
  case "ADMIN":
    window.location.href = "/admin";
    return;

  case "DEVELOPER":
    window.location.href = "/developer";
    return;

      case "SELLER":
      window.location.href = "/sales";
      return;

  case "CLIENT":
    window.location.href = "/client";
    return;

  default:
    toast.error("Invalid user role");
    return;
}
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground transition-colors duration-200">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">

        {/* LOGO + HEADER */}
        <div className="flex flex-col items-center space-y-4 text-center">
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

        {/* FORM */}
        <div className="space-y-4">

          {/* EMAIL */}
          <Input
            type="email"
            placeholder="Email"
            className="rounded-xl"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />

          {/* PASSWORD */}
          <div className="relative">
            <Input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Password"
              className="rounded-xl pr-10"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (prev) => !prev
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              tabIndex={-1}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* REMEMBER + FORGOT */}
          <div className="flex items-center justify-between text-xs">

            <label className="flex cursor-pointer select-none items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(
                    e.target.checked
                  )
                }
                className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
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

          {/* SIGN IN */}
          <Button
            className="h-10 w-full rounded-xl font-semibold transition-all active:scale-[0.99]"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </Button>

          {/* SIGN UP */}
          <div className="pt-2 text-center">
            <Link
              href="/auth/signup"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline"
            >
              Don&apos;t have an account?{" "}
              <span className="font-medium text-primary">
                Sign up
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}