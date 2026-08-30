import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/lib/supabase/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  let uploadedPublicId: string | null = null;

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

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (
      profileError ||
      profile?.role?.toUpperCase() !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const formData = await request.formData();

    const title = String(
      formData.get("title") ?? ""
    ).trim();

    const description = String(
      formData.get("description") ?? ""
    ).trim();

    const category = String(
      formData.get("category") ?? ""
    ).trim();

    const file = formData.get("file");

    if (
      !title ||
      !category ||
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          error:
            "Title, category and PDF are required.",
        },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { status: 400 }
      );
    }

    // 10 MB maximum
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "PDF must be smaller than 10 MB.",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const safeName = file.name
      .replace(/\.pdf$/i, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-");

    const publicId = `zaynex/resources/${Date.now()}-${safeName}`;

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            public_id: publicId,
            type: "upload",
          },
          (error, result) => {
            if (error || !result) {
              reject(
                error ??
                  new Error(
                    "Cloudinary upload failed."
                  )
              );
              return;
            }

            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );

      uploadStream.end(buffer);
    });

    uploadedPublicId = uploadResult.public_id;

    /*
     * Cloudinary raw files are delivered through
     * the secure URL returned by Cloudinary.
     */
    const fileUrl = uploadResult.secure_url;

    const { error: databaseError } = await supabase
      .from("resources")
      .insert({
        title,
        description: description || null,
        category,
        file_url: fileUrl,
        file_public_id: uploadedPublicId,
      });

    if (databaseError) {
      console.error(
        "SAVE RESOURCE ERROR:",
        databaseError
      );

      // Remove uploaded PDF if database save failed
      try {
        await cloudinary.uploader.destroy(
          uploadedPublicId,
          {
            resource_type: "raw",
            type: "upload",
          }
        );
      } catch (cleanupError) {
        console.error(
          "CLOUDINARY CLEANUP ERROR:",
          cleanupError
        );
      }

      return NextResponse.json(
        {
          error:
            databaseError.message ||
            "Failed to save resource.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Resource uploaded successfully.",
      resource: {
        title,
        category,
        file_url: fileUrl,
      },
    });
  } catch (error) {
    console.error(
      "RESOURCE UPLOAD ERROR:",
      error
    );

    // Cleanup if Cloudinary succeeded but another error occurred
    if (uploadedPublicId) {
      try {
        await cloudinary.uploader.destroy(
          uploadedPublicId,
          {
            resource_type: "raw",
            type: "upload",
          }
        );
      } catch (cleanupError) {
        console.error(
          "CLOUDINARY CLEANUP ERROR:",
          cleanupError
        );
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Upload failed.",
      },
      { status: 500 }
    );
  }
}