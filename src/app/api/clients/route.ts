import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request
) {
  try {
    const {
      full_name,
      email,
      phone,
      password,
    } = await request.json();

    if (
      !full_name ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          message:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data: authUser,
      error: authError,
    } =
      await supabaseAdmin.auth.admin.createUser(
        {
          email,
          password,

          email_confirm: true,
        }
      );

    if (authError) {
      return NextResponse.json(
        {
          message:
            authError.message,
        },
        {
          status: 400,
        }
      );
    }

    const userId =
      authUser.user.id;

    const {
      error: profileError,
    } = await supabaseAdmin
  .from("profiles")
  .update({
    full_name,
    phone,
    role: "CLIENT",
  })
  .eq("id", userId);

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(
        userId
      );

      return NextResponse.json(
        {
          message:
            profileError.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Client created successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}