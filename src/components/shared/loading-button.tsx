"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type LoadingButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export function LoadingButton({
  href,
  children,
  variant = "default",
  size = "sm",
  className = "",
}: LoadingButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startTransition(() => {
      window.location.href = href;
    });
  };

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
      disabled={isPending}
    >
      <Link href={href} onClick={handleClick}>
        {isPending ? (
          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
        ) : null}
        {children}
      </Link>
    </Button>
  );
}