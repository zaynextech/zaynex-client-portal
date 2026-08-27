"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { uploadPortfolioGallery } from "@/features/portfolio/actions/upload-portfolio-gallery";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function UploadPortfolioGallery({
  value,
  onChange,
}: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const uploadedUrls =
        await uploadPortfolioGallery(formData);

      onChange([
        ...value,
        ...uploadedUrls,
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(image: string) {
    onChange(
      value.filter((url) => url !== image)
    );
  }

  return (
    <div className="space-y-4">
      <Input
        type="file"
        multiple
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />

      {uploading && (
        <p className="text-sm text-muted-foreground">
          Uploading...
        </p>
      )}

      {value.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((image) => (
            <div
              key={image}
              className="relative overflow-hidden rounded-lg border"
            >
              <Image
                src={image}
                alt="Gallery Image"
                width={600}
                height={400}
                className="h-40 w-full object-cover"
              />

              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute right-2 top-2"
                onClick={() => removeImage(image)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}