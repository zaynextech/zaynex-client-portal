import { createClient } from "@/lib/supabase/server";

interface CreateNotificationProps {
  userId: string;
  title: string;
  message: string;
  href?: string;
}

export async function createNotification({
  userId,
  title,
  message,
  href,
}: CreateNotificationProps) {
  const supabase =
    await createClient();

  console.log("Creating notification");

  const { data, error } =
    await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        message,
        href,
      })
      .select();

  console.log(
    "Notification result:",
    data
  );

  console.log(
    "Notification error:",
    error
  );

  if (error) {
    throw new Error(
      error.message
    );
  }
}