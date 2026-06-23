"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const handleLogout =
    async () => {
      try {
        setLoading(true);

        const supabase =
          createClient();

        await supabase.auth.signOut();

        router.replace(
          "/auth/login"
        );

        router.refresh();
      } finally {
        setLoading(false);
      }
    };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading
        ? "Signing Out..."
        : "Sign Out"}
    </Button>
  );
}