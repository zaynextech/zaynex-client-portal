// src/app/api/cron/ticket-reminders/route.ts

import { NextResponse } from "next/server";

import { checkTicketReminders } from "@/features/support/actions/check-ticket-reminders";

export async function GET(
  request: Request
) {
  try {
    const authHeader =
      request.headers.get(
        "authorization"
      );

    if (
      process.env.CRON_SECRET &&
      authHeader !==
        `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await checkTicketReminders();

    return NextResponse.json({
      success: true,
      message:
        "Ticket reminders processed successfully",
    });
  } catch (error) {
    console.error(
      "TICKET REMINDER CRON ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}