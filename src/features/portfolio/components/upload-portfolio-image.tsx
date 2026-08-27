"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { uploadPortfolioImage } from "@/features/portfolio/actions/upload-portfolio-image";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export function UploadPortfolioImage({
  value,
  onChange,
}: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const url = await uploadPortfolioImage(formData);

      onChange(url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
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

          <Input value={value} readOnly />
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        disabled={uploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {uploading ? "Uploading..." : "Upload Image"}
      </Button>
    </div>
  );
}