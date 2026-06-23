"use client";
import {
  formatDistanceToNow,
} from "date-fns";

import { useRouter } from "next/navigation";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { markNotificationRead } from "@/features/notifications/actions/mark-notification-read";
import { deleteNotification } from "@/features/notifications/actions/delete-notification";

interface Props {
  notification: {
    id: string;
    title: string;
    message: string;
    href: string | null;
    is_read: boolean;
    created_at: string;
  };
}

export function NotificationItem({
  notification,
}: Props) {
  const router =
    useRouter();

 


  const handleClick =
    async () => {
      await markNotificationRead(
        notification.id
      );

      router.push(
        notification.href ??
          "/notifications"
      );
    };

  const handleDelete =
    async (
      e: React.MouseEvent
    ) => {
      e.stopPropagation();

      await deleteNotification(
        notification.id
      );

      router.refresh();
    };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-xl border p-4 transition-colors hover:bg-muted"
    >
      <div className="flex gap-3">
        {!notification.is_read && (
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium">
                {notification.title}
              </h3>

           <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(
                new Date(
                  notification.created_at
                ),
                {
                  addSuffix: true,
                }
              )}
            </p>
            </div>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={
                handleDelete
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {
              notification.message
            }
          </p>
        </div>
      </div>
    </div>
  );
}