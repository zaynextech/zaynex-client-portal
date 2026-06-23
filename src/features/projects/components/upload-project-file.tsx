"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { uploadProjectFile } from "@/features/projects/actions/upload-project-file";

interface UploadProjectFileProps {
  projectId: string;
}

export function UploadProjectFile({
  projectId,
}: UploadProjectFileProps) {
  const router = useRouter();

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error(
        "Please select a file"
      );
      return;
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "projectId",
        projectId
      );

      formData.append(
        "file",
        file
      );

      await uploadProjectFile(
        formData
      );

      toast.success(
        "File uploaded successfully"
      );

      setFile(null);

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to upload file"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input
        type="file"
        onChange={(e) =>
          setFile(
            e.target.files?.[0] ??
              null
          )
        }
      />

      <Button
        onClick={handleUpload}
        disabled={
          loading || !file
        }
      >
        {loading
          ? "Uploading..."
          : "Upload"}
      </Button>
    </div>
  );
}