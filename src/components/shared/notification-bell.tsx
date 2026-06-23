import Link from "next/link";

import { Bell } from "lucide-react";

interface NotificationBellProps {
  count: number;
  href: string;
}

export function NotificationBell({
  count,
  href,
}: NotificationBellProps) {
  return (
    <Link
      href={href}
      className="relative flex items-center justify-center"
    >
      <Bell className="h-5 w-5" />

      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
          {count > 99
            ? "99+"
            : count}
        </span>
      )}
    </Link>
  );
}