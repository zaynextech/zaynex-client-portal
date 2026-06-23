"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { uploadProjectFile } from "@/features/projects/actions/upload-project-file";

interface ClientUploadFileProps {
  projectId: string;
}

export function ClientUploadFile({
  projectId,
}: ClientUploadFileProps) {
  const router = useRouter();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const handleUpload = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

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
        "file",
        file
      );

      formData.append(
        "projectId",
        projectId
      );

      formData.append(
        "uploadedByRole",
        "CLIENT"
      );

      await uploadProjectFile(
        formData
      );

      toast.success(
        "File uploaded successfully"
      );

      setFile(null);

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }

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
    <form
      onSubmit={handleUpload}
      className="space-y-4"
    >
      <Input
        ref={fileInputRef}
        type="file"
        onChange={(e) =>
          setFile(
            e.target.files?.[0] ||
              null
          )
        }
      />

      {file && (
        <p className="text-sm text-muted-foreground">
          Selected: {file.name}
        </p>
      )}

      <Button
        type="submit"
        disabled={
          loading || !file
        }
      >
        {loading
          ? "Uploading..."
          : "Upload File"}
      </Button>
    </form>
  );
}