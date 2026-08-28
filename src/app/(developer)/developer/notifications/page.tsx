import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { NotificationItem } from "@/features/notifications/components/notification-item";

export default async function DeveloperNotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <PageContainer>
      <PageHeader
        title="Notifications"
        description="Recent updates and alerts"
      />

      <div className="space-y-4">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <div className="rounded-lg border border-border/60 bg-card p-8 text-center">
            <p className="text-sm font-medium text-foreground">
              No notifications
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              You&apos;re all caught up. New project updates will appear here.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}