import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mb-4 text-7xl font-bold">
          404
        </div>

        <h1 className="mb-2 text-2xl font-semibold">
          Page Not Found
        </h1>

        <p className="mb-6 text-muted-foreground">
          The page you are looking for
          doesn&apos;t exist or may have been
          moved.
        </p>

        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/">
              Go Home
            </Link>
          </Button>

          <Button
            variant="outline"
            asChild
          >
            <Link href="/admin">
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}