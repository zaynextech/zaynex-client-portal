"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Home,
  PlusCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

export default function ProjectRequestSuccessPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Project Request Submitted"
        description="Your request has been received successfully."
      />

      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 sm:p-10 text-center shadow-sm">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2
            size={32}
            className="animate-in zoom-in-50 duration-300"
          />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Thank You
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Thank you for choosing{" "}
          <span className="font-semibold text-foreground">
            Zaynex
          </span>
          . Your project request has been submitted successfully.
          Our team will review your requirements and contact you shortly with the next steps.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            className="h-11 w-full gap-2 rounded-xl font-semibold sm:flex-1"
          >
            <a href="https://www.zaynex.tech">
              <Home size={16} />
              Back to Zaynex
            </a>
          </Button>

          <Button
            variant="outline"
            asChild
            className="h-11 w-full gap-2 rounded-xl font-semibold sm:flex-1"
          >
            <Link href="/start-project">
              <PlusCircle size={16} />
              Start Another Project
            </Link>
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs tracking-wide text-muted-foreground/60">
        Building modern websites, web applications, online stores, and digital solutions for growing businesses.
      </p>
    </PageContainer>
  );
}