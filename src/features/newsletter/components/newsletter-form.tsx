"use client";

import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "../actions/subscribe";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");

    startTransition(async () => {
      const result = await subscribeToNewsletter(email);

      setMessage(result.message);

      if (result.success) {
        setEmail("");
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-md text-center">
      <form onSubmit={handleSubmit} className="flex justify-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "..." : "Subscribe"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          {message}
        </p>
      )}
    </div>
  );
}