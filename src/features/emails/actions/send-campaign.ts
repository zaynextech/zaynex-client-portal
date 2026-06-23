// src/features/emails/actions/send-campaign.ts

"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { resend } from "@/lib/resend";

import {
  buildCampaignEmail,
  type CampaignType,
} from "@/lib/emails/templates/campaigns";

interface SendCampaignInput {
  campaignType: string;
  audience: string;
  title: string;
  message: string;
  includeRatingLink: boolean;
  includeWebsiteLink: boolean;
}

export async function sendCampaign({
  campaignType,
  audience,
  title,
  message,
  includeRatingLink,
  includeWebsiteLink,
}: SendCampaignInput) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "Unauthorized"
    );
  }

  let emails: string[] = [];

  switch (audience) {
    case "ALL_CONTACTS": {
      const { data } =
        await supabase
          .from("profiles")
          .select("email");

      emails =
        data
          ?.map(
            (item) =>
              item.email
          )
          .filter(
            Boolean
          ) ?? [];

      break;
    }

    case "SUBSCRIBERS": {
      const { data } =
        await supabase
          .from(
            "newsletter_subscribers"
          )
          .select("email")
          .eq(
            "active",
            true
          );

      emails =
        data
          ?.map(
            (item) =>
              item.email
          )
          .filter(
            Boolean
          ) ?? [];

      break;
    }

    case "CLIENTS": {
      const { data } =
        await supabase
          .from("profiles")
          .select(
            "email"
          )
          .eq(
            "role",
            "CLIENT"
          );

      emails =
        data
          ?.map(
            (item) =>
              item.email
          )
          .filter(
            Boolean
          ) ?? [];

      break;
    }
case "CLIENTS_WITH_PROJECTS": {
  const { data } =
    await supabase
      .from("projects")
      .select(`
        client:profiles(
          email
        )
      `);

  emails = (
    (data ?? []) as {
      client:
        | {
            email: string | null;
          }[]
        | null;
    }[]
  )
    .flatMap(
      (project) =>
        project.client ?? []
    )
    .map(
      (client) =>
        client.email
    )
    .filter(
      (
        email
      ): email is string =>
        Boolean(email)
    );

  break;
}

    case "CLIENTS_WITHOUT_PROJECTS": {
      const {
        data: clients,
      } =
        await supabase
          .from("profiles")
          .select(`
            id,
            email
          `)
          .eq(
            "role",
            "CLIENT"
          );

      const {
        data: projects,
      } =
        await supabase
          .from("projects")
          .select(
            "client_id"
          );

      const clientIds =
        new Set(
          projects?.map(
            (
              project
            ) =>
              project.client_id
          ) ?? []
        );

      emails =
        clients
          ?.filter(
            (
              client
            ) =>
              !clientIds.has(
                client.id
              )
          )
          .map(
            (
              client
            ) =>
              client.email
          )
          .filter(
            Boolean
          ) ?? [];

      break;
    }

    default:
      throw new Error(
        "Invalid audience"
      );
  }

  emails = [
    ...new Set(emails),
  ];

  if (
    emails.length === 0
  ) {
    throw new Error(
      "No recipients found"
    );
  }

  const emailContent =
    buildCampaignEmail({
      type:
        campaignType as CampaignType,
      title,
      message,
      includeRatingLink,
      includeWebsiteLink,
    });

  const batchSize = 50;

  for (
    let i = 0;
    i < emails.length;
    i += batchSize
  ) {
    const batch =
      emails.slice(
        i,
        i + batchSize
      );

    await resend.emails.send({
      from:
        "Zaynex <contact@zaynex.tech>",
      to: batch,
      subject:
        emailContent.subject,
      html:
        emailContent.html,
    });
  }

  await supabase
    .from(
      "email_campaigns"
    )
    .insert({
      title,
      campaign_type:
        campaignType,
      audience,
      message,
      include_rating_link:
        includeRatingLink,
      include_website_link:
        includeWebsiteLink,
      sent_count:
        emails.length,
      created_by:
        user.id,
    });

  revalidatePath(
    "/admin/emails"
  );

  return {
    success: true,
    sentCount:
      emails.length,
  };
}