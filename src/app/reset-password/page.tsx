"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";



export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const supabase =
    createClient();

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error(
        "Please enter a password"
      );

      return;
    }

    if (password.length < 8) {
      toast.error(
        "Password must be at least 8 characters"
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );

      return;
    }

    try {
      setLoading(true);

      const { error } =
        await supabase.auth.updateUser(
          {
            password,
          }
        );

      if (error) {
        const message =
          error.message.toLowerCase();

        if (
          message.includes(
            "same"
          ) ||
          message.includes(
            "different"
          )
        ) {
          toast.error(
            "Your new password must be different from your current password."
          );

          return;
        }

        if (
          message.includes(
            "expired"
          ) ||
          message.includes(
            "invalid"
          ) ||
          message.includes(
            "otp"
          )
        ) {
          toast.error(
            "This reset link is invalid or has expired. Please request a new password reset email."
          );

          return;
        }

        if (
          message.includes(
            "weak"
          )
        ) {
          toast.error(
            "Please choose a stronger password."
          );

          return;
        }

        if (
          message.includes(
            "session"
          )
        ) {
          toast.error(
            "Your reset session has expired. Please request a new password reset email."
          );

          return;
        }

        toast.error(
          error.message
        );

        return;
      }

      toast.success(
        "Password updated successfully"
      );

      setTimeout(() => {
        router.push(
          "/auth/login"
        );
      }, 1000);
    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <div className="w-full max-w-md rounded-xl border p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Reset Password
          </h1>

          <p className="text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              New Password
            </label>

            <Input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>

            <Input
              type="password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm new password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}