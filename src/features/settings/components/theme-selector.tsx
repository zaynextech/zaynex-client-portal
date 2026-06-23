"use client";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeSelector() {
  const {
    resolvedTheme,
    setTheme,
  } = useTheme();

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium">
          Theme
        </h4>

        <p className="text-sm text-muted-foreground">
          Choose your preferred theme.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={
            resolvedTheme === "light"
              ? "default"
              : "outline"
          }
          onClick={() =>
            setTheme("light")
          }
        >
          Light
        </Button>

        <Button
          variant={
            resolvedTheme === "dark"
              ? "default"
              : "outline"
          }
          onClick={() =>
            setTheme("dark")
          }
        >
          Dark
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            setTheme("system")
          }
        >
          System
        </Button>
      </div>
    </div>
  );
}