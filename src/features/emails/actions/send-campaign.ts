"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import {
  buildCampaignEmail,
  type CampaignType,
} from "@/lib/emails/templates/campaigns";

interface SendCampaignInput {
  campaignType: string;
  audience: string;
  selectedContacts?: string[];
  selectedRole?: string;
  title: string;
  message: string;
  includeRatingLink: boolean;
  includeWebsiteLink: boolean;
}

const getEmails = (data: { email: string | null }[] | null) =>
  (data ?? [])
    .map((item) => item.email)
    .filter((email): email is string => Boolean(email));

export async function sendCampaign({
  campaignType,
  audience,
  selectedContacts = [],
  selectedRole,
  title,
  message,
  includeRatingLink,
  includeWebsiteLink,
}: SendCampaignInput) {
  // Check logged-in user
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get recipients
  let emails: string[] = [];

  switch (audience) {
    // SELECTED PEOPLE
    case "INDIVIDUALS": {
      if (selectedContacts.length === 0) {
        throw new Error("Please select at least one recipient");
      }

      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("email")
        .in("id", selectedContacts);

      if (error) {
        console.error("Selected recipients error:", error);
        throw new Error("Failed to find selected recipients");
      }

      emails = getEmails(data);
      break;
    }

    // SELECT BY ROLE
    case "ROLE": {
      if (!selectedRole) {
        throw new Error("Please select a role");
      }

      const allowedRoles = [
        "CLIENT",
        "DEVELOPER",
        "SALES",
        "ADMIN",
      ];

      if (!allowedRoles.includes(selectedRole)) {
        throw new Error("Invalid role");
      }

      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("email")
        .eq("role", selectedRole);

      if (error) {
        console.error("Role recipients error:", error);
        throw new Error("Failed to find recipients");
      }

      emails = getEmails(data);
      break;
    }

    // EVERYONE
    case "ALL_CONTACTS": {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("email");

      if (error) {
        console.error("All contacts error:", error);
        throw new Error("Failed to find contacts");
      }

      emails = getEmails(data);
      break;
    }

    // NEWSLETTER SUBSCRIBERS
    case "SUBSCRIBERS": {
      const { data, error } = await supabaseAdmin
        .from("newsletter_subscribers")
        .select("email")
        .eq("active", true);

      if (error) {
        console.error("Subscribers error:", error);
        throw new Error("Failed to find subscribers");
      }

      emails = getEmails(data);
      break;
    }

    // CLIENTS
    case "CLIENTS": {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("email")
        .eq("role", "CLIENT");

      if (error) {
        console.error("Clients error:", error);
        throw new Error("Failed to find clients");
      }

      emails = getEmails(data);
      break;
    }

    // CLIENTS WITH PROJECTS
    case "CLIENTS_WITH_PROJECTS": {
      const { data, error } = await supabaseAdmin
        .from("projects")
        .select(`
          client:profiles(
            email
          )
        `);

      if (error) {
        console.error(
          "Clients with projects error:",
          error
        );

        throw new Error(
          "Failed to find clients with projects"
        );
      }

      emails = (
        (data ?? []) as {
          client:
            | {
                email: string | null;
              }[]
            | null;
        }[]
      )
        .flatMap((project) => project.client ?? [])
        .map((client) => client.email)
        .filter(
          (email): email is string => Boolean(email)
        );

      break;
    }

    // CLIENTS WITHOUT PROJECTS
    case "CLIENTS_WITHOUT_PROJECTS": {
      const {
        data: clients,
        error: clientsError,
      } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .eq("role", "CLIENT");

      if (clientsError) {
        console.error(
          "Clients without projects error:",
          clientsError
        );

        throw new Error("Failed to find clients");
      }

      const {
        data: projects,
        error: projectsError,
      } = await supabaseAdmin
        .from("projects")
        .select("client_id");

      if (projectsError) {
        console.error(
          "Projects lookup error:",
          projectsError
        );

        throw new Error("Failed to find projects");
      }

      const clientIds = new Set(
        projects?.map(
          (project) => project.client_id
        ) ?? []
      );

      emails =
        clients
          ?.filter(
            (client) =>
              !clientIds.has(client.id)
          )
          .map((client) => client.email)
          .filter(
            (email): email is string =>
              Boolean(email)
          ) ?? [];

      break;
    }

    default:
      throw new Error("Invalid audience");
  }

  // Remove empty and duplicate emails
  emails = [
    ...new Set(
      emails
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
    ),
  ];

  if (emails.length === 0) {
    throw new Error("No recipients found");
  }

  // Build email
  const emailContent = buildCampaignEmail({
    type: campaignType as CampaignType,
    title,
    message,
    includeRatingLink,
    includeWebsiteLink,
  });

  // Send emails in batches
  const batchSize = 50;

  for (
    let i = 0;
    i < emails.length;
    i += batchSize
  ) {
    const batch = emails.slice(
      i,
      i + batchSize
    );

    const { error } = await resend.emails.send({
      from: "Zaynex <contact@zaynex.tech>",
      to: batch,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (error) {
      console.error("Resend error:", error);

      throw new Error(
        "Failed to send email"
      );
    }
  }

  // Save campaign history
  const { error: campaignError } =
    await supabase
      .from("email_campaigns")
      .insert({
        title,
        campaign_type: campaignType,
        audience,
        message,
        include_rating_link:
          includeRatingLink,
        include_website_link:
          includeWebsiteLink,
        sent_count: emails.length,
        created_by: user.id,
      });

  if (campaignError) {
    console.error(
      "Campaign history error:",
      campaignError
    );
  }

  revalidatePath("/admin/emails");

  return {
    success: true,
    sentCount: emails.length,
  };
}