"use client";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { subscribeToNewsletter } from "@/features/newsletter/actions/subscribe";
import Image from "next/image";
import { useState, useTransition } from "react";


export default function NewsletterSubscribers() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    <main className="relative flex min-h-[80vh] items-center justify-center p-6">
      {/* Theme Toggle Positioned Top Right */}
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-xl text-center">
        <div className="mb-8 flex justify-center">
          <Image
            src="https://res.cloudinary.com/dn39ukq3q/image/upload/v1782149488/logo_zilmtc.png"
            alt="Zaynex"
            width={120}
            height={40}
            priority
            draggable={false}
            className="h-10 w-auto select-none object-contain dark:brightness-200"
          />
        </div>

        <h1 className="text-2xl font-semibold">
          Newsletter Subscribers
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Subscribe to the Zaynex newsletter.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex justify-center gap-2"
        >
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
    </main>
  );
}