import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/lib/supabase/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role?.toUpperCase() !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Resource ID is required." },
        { status: 400 }
      );
    }

    const { data: resource, error: fetchError } =
      await supabase
        .from("resources")
        .select("id, file_public_id")
        .eq("id", id)
        .single();

    if (fetchError || !resource) {
      return NextResponse.json(
        { error: "Resource not found." },
        { status: 404 }
      );
    }

    // Delete PDF from Cloudinary
    if (resource.file_public_id) {
      await cloudinary.uploader.destroy(
        resource.file_public_id,
        {
          resource_type: "raw",
        }
      );
    }

    // Delete metadata from Supabase
    const { error: deleteError } = await supabase
      .from("resources")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(
        "DELETE RESOURCE ERROR:",
        deleteError
      );

      return NextResponse.json(
        { error: "Failed to delete resource." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "RESOURCE DELETE ERROR:",
      error
    );

    return NextResponse.json(
      { error: "Delete failed." },
      { status: 500 }
    );
  }
}