"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadPortfolioGallery(formData: FormData) {
  const files = formData.getAll("files");

  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (!(file instanceof File)) {
      continue;
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const url = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "zaynex/portfolio/gallery",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"));
            return;
          }

          resolve(result.secure_url);
        }
      );

      uploadStream.end(buffer);
    });

    uploadedUrls.push(url);
  }

  return uploadedUrls;
}