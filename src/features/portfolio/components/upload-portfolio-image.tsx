"use client";

import { useState } from "react";

import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface Props {
  value: string;
  onChange: (
    url: string
  ) => void;
}

export function UploadPortfolioImage({
  value,
  onChange,
}: Props) {
  const [uploading, setUploading] =
    useState(false);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);

      const supabase =
        createClient();

      const fileName =
        `${Date.now()}-${file.name}`;

      const filePath =
        `thumbnails/${fileName}`;

      const { error } =
        await supabase.storage
          .from("portfolio")
          .upload(
            filePath,
            file,
            {
              upsert: false,
            }
          );

      if (error) {
        throw error;
      }

      const { data } =
        supabase.storage
          .from("portfolio")
          .getPublicUrl(
            filePath
          );

      onChange(
        data.publicUrl
      );
    } catch (error) {
      console.error(
        error
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        onChange={
          handleUpload
        }
      />

      {uploading && (
        <p className="text-sm text-muted-foreground">
          Uploading...
        </p>
      )}

      {value && (
        <div className="space-y-3">
          <Image
            src={value}
            alt="Preview"
            width={800}
            height={400}
            className="h-48 w-full rounded-lg border object-cover"
            />

          <Input
            value={value}
            readOnly
          />
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        disabled={
          uploading
        }
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading
          ? "Uploading..."
          : "Upload Image"}
      </Button>
    </div>
  );
}