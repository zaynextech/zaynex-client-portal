import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/admin";

import { createNotification } from "@/lib/notifications/create-notification";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods":
        "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization",
    },
  });
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const supabase =
  supabaseAdmin;

    const {
      client_name,
      email,
      phone,
      meeting_type,
      meeting_date,
      meeting_time,
      notes,
    } = body;

    const {
      data: meeting,
      error,
    } = await supabase
      .from("meetings")
      .insert({
        client_name,
        email,
        phone,

        meeting_type:
          meeting_type ??
          "Consultation",

        meeting_date,
        meeting_time,

        notes,

        status:
          "PENDING",
      })
      .select()
      .single();

    if (error) {
      console.error(
        "MEETING ERROR:",
        error
      );

      return NextResponse.json(
        {
          message:
            error.message,
        },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin":
              "*",
          },
        }
      );
    }

    const {
      data: admins,
    } = await supabase
      .from("profiles")
      .select("id")
      .eq(
        "role",
        "ADMIN"
      );

    for (const admin of admins ??
      []) {
      await createNotification({
        userId: admin.id,

        title:
          "New Meeting Request",

        message: `${client_name} requested a meeting.`,

        href:
          "/admin/meetings",
      });
    }

    return NextResponse.json(
      {
        success: true,
        meeting,
      },
      {
        headers: {
          "Access-Control-Allow-Origin":
            "*",
        },
      }
    );
  } catch (error) {
    console.error(
      "API ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Internal server error",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin":
            "*",
        },
      }
    );
  }
}