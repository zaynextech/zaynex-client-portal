"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import { sendClientInvitationEmail } from "@/lib/emails/send-client-invitation-email";

export async function createClientFromRequest(
  requestId: string
) {
  const supabase =
    await createClient();

  const adminSupabase =
    createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

  const {
    data: request,
    error: requestError,
  } = await supabase
    .from("project_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (requestError) {
    console.error(
      "REQUEST FETCH ERROR:",
      requestError
    );

    throw new Error(
      requestError.message
    );
  }

  if (!request) {
    throw new Error(
      "Project request not found"
    );
  }

if (request.client_id) {
  return {
    success: true,
    clientId:
      request.client_id,
    existingUser: true,
  };
}

const {
  data: existingProfile,
  error: existingProfileError,
} = await adminSupabase
  .from("profiles")
  .select("id,email")
  .eq(
    "email",
    request.email
  )
  .maybeSingle();

if (
  existingProfileError
) {
  throw new Error(
    existingProfileError.message
  );
}

if (existingProfile) {
  const {
    error: updateError,
  } = await adminSupabase
    .from("project_requests")
    .update({
      client_id:
        existingProfile.id,
    })
    .eq("id", requestId);

  if (updateError) {
    throw new Error(
      updateError.message
    );
  }

  revalidatePath(
    "/admin/project-requests"
  );

  revalidatePath(
    `/admin/project-requests/${requestId}`
  );

  revalidatePath(
    `/admin/project-requests/${requestId}/create-project`
  );

  return {
    success: true,
    clientId:
      existingProfile.id,
    existingUser: true,
  };
}

const tempPassword =
  "Zaynex@pass";

  const {
    data: authUser,
    error: authError,
  } =
    await adminSupabase.auth.admin.createUser(
      {
        email: request.email,
        password:
          tempPassword,
        email_confirm: true,
      }
    );

  if (authError) {
    console.error(
      "AUTH CREATE ERROR:",
      authError
    );

    if (
      authError.message.includes(
        "already been registered"
      )
    ) {
      const {
        data: existingProfile,
        error: profileLookupError,
      } = await adminSupabase
        .from("profiles")
        .select("id,email")
        .eq(
          "email",
          request.email
        )
        .single();

      if (
        profileLookupError ||
        !existingProfile
      ) {
        throw new Error(
          "User exists but profile was not found."
        );
      }

      const {
        error: updateError,
      } = await adminSupabase
        .from("project_requests")
        .update({
          client_id:
            existingProfile.id,
        })
        .eq("id", requestId);

      if (updateError) {
        throw new Error(
          updateError.message
        );
      }

      revalidatePath(
        "/admin/project-requests"
      );

      revalidatePath(
        `/admin/project-requests/${requestId}`
      );

      revalidatePath(
        `/admin/project-requests/${requestId}/create-project`
      );

      return {
        success: true,
        clientId:
          existingProfile.id,
        existingUser: true,
      };
    }

    throw new Error(
      authError.message
    );
  }

  if (!authUser?.user) {
    throw new Error(
      "Failed to create auth user."
    );
  }

  const userId =
    authUser.user.id;

const {
  error: profileError,
} = await adminSupabase
  .from("profiles")
  .upsert(
    {
      id: userId,
      email: request.email,
      role: "CLIENT",
      full_name:
        request.company_name,
      company_name:
        request.company_name,
    },
    {
      onConflict: "id",
    }
  );

  if (profileError) {
    console.error(
      "PROFILE CREATE ERROR:",
      profileError
    );

    await adminSupabase.auth.admin.deleteUser(
      userId
    );

    throw new Error(
      profileError.message
    );
  }

  const {
    error: updateError,
  } = await adminSupabase
    .from("project_requests")
    .update({
      client_id: userId,
    })
    .eq("id", requestId);

  if (updateError) {
    console.error(
      "REQUEST UPDATE ERROR:",
      updateError
    );

    await adminSupabase.auth.admin.deleteUser(
      userId
    );

    throw new Error(
      updateError.message
    );
  }

  try {
    await sendClientInvitationEmail({
      email: request.email,
      companyName:
        request.company_name,
      password:
        tempPassword,
    });
  } catch (emailError) {
    console.error(
      "EMAIL ERROR:",
      emailError
    );
  }

  revalidatePath(
    "/admin/clients"
  );

  revalidatePath(
    "/admin/project-requests"
  );

  revalidatePath(
    `/admin/project-requests/${requestId}`
  );

  revalidatePath(
    `/admin/project-requests/${requestId}/create-project`
  );

  return {
    success: true,
    clientId: userId,
    existingUser: false,
  };
}