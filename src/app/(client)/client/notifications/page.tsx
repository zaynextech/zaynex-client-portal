import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { NotificationItem } from "@/features/notifications/components/notification-item";

export default async function ClientNotificationsPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notifications } =
    await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", {
        ascending: false,
      });

  return (
    <PageContainer>
      <PageHeader
        title="Notifications"
        description="Your recent notifications"
      />

      <div className="space-y-4">
        {notifications?.length ? (
          notifications.map(
            (notification) => (
              <NotificationItem
                key={
                  notification.id
                }
                notification={
                  notification
                }
              />
            )
          )
        ) : (
          <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
            No notifications found.
          </div>
        )}
      </div>
    </PageContainer>
  );
}