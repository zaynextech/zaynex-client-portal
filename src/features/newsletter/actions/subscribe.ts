"use server";

import { createClient } from "@/lib/supabase/server";

export async function subscribeToNewsletter(email: string) {
  const supabase = await createClient();

  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !cleanEmail.includes("@")) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email: cleanEmail,
      active: true,
    });

  if (error) {
    console.error("Newsletter subscription error:", error);

    if (error.code === "23505") {
      return {
        success: false,
        message: "This email is already subscribed.",
      };
    }

    return {
      success: false,
      message: "Unable to subscribe. Please try again.",
    };
  }

  return {
    success: true,
    message: "You're subscribed successfully.",
  };
}