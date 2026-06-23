"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function TimezoneSelector() {
  const [timezone, setTimezone] =
    useState(
      "Asia/Kolkata"
    );

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium">
          Timezone
        </h4>

        <p className="text-sm text-muted-foreground">
          Configure your timezone.
        </p>
      </div>

      <div className="flex gap-2">
        <select
          value={timezone}
          onChange={(e) =>
            setTimezone(
              e.target.value
            )
          }
          className="rounded-md border px-3 py-2"
        >
          <option value="Asia/Kolkata">
            Asia/Kolkata
          </option>

          <option value="Africa/Juba">
            Africa/Juba
          </option>

          <option value="UTC">
            UTC
          </option>
        </select>

        <Button>
          Save
        </Button>
      </div>
    </div>
  );
}