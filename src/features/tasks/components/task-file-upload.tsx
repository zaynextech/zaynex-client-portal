"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface TaskFileUploadProps {
  taskId: string;
}

export function TaskFileUpload({
  taskId,
}: TaskFileUploadProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be logged in.");
      }

      /*
       * Keep the file inside a task-specific folder.
       */
      const extension = file.name.includes(".")
        ? `.${file.name.split(".").pop()}`
        : "";

      const filePath = `tasks/${taskId}/${crypto.randomUUID()}${extension}`;

      /*
       * Upload to Supabase Storage.
       *
       * IMPORTANT:
       * Change "project-files" only if your existing
       * Supabase storage bucket has a different name.
       */
      const { error: uploadError } = await supabase.storage
        .from("project-files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("project-files")
        .getPublicUrl(filePath);

      const fileUrl = publicUrlData.publicUrl;

      /*
       * Save the uploaded file in task_files.
       */
      const { error: insertError } = await supabase
        .from("task_files")
        .insert({
          task_id: taskId,
          file_name: file.name,
          file_url: fileUrl,
          uploaded_by: user.id,
        });

      if (insertError) {
        /*
         * If DB insertion fails, remove the uploaded
         * storage object so we don't leave an orphan file.
         */
        await supabase.storage
          .from("project-files")
          .remove([filePath]);

        throw new Error(insertError.message);
      }

      router.refresh();
    } catch (error) {
      console.error("Task file upload failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload file."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </>
        )}
      </Button>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
    </>
  );
}