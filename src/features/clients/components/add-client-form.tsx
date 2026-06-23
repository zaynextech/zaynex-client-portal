"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddClientForm() {
  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const formData =
      new FormData(
        e.currentTarget
      );

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/clients",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              {
                full_name:
                  formData.get(
                    "full_name"
                  ),
                email:
                  formData.get(
                    "email"
                  ),
                phone:
                  formData.get(
                    "phone"
                  ),
                password:
                  formData.get(
                    "password"
                  ),
              }
            ),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.message
        );
      }

      toast.success(
        "Client created successfully"
      );

      (
        e.target as HTMLFormElement
      ).reset();
    } catch (error) {
      toast.error(
        error instanceof
          Error
          ? error.message
          : "Failed to create client"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border p-6"
    >
      <Input
        name="full_name"
        placeholder="Full Name"
        required
      />

      <Input
        name="email"
        type="email"
        placeholder="Email Address"
        required
      />

      <Input
        name="phone"
        placeholder="Phone Number"
      />

      <Input
        name="password"
        type="password"
        placeholder="Temporary Password"
        required
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading
          ? "Creating..."
          : "Create Client"}
      </Button>
    </form>
  );
}