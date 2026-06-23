import Link from "next/link";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface ProjectFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  created_at: string;
}

interface ProjectFilesProps {
  files: ProjectFile[];
}

function formatFileSize(
  bytes: number | null
) {
  if (!bytes) return "-";

  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(
    1
  )} MB`;
}

export function ProjectFiles({
  files,
}: ProjectFilesProps) {
  if (!files.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No files uploaded yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <Card key={file.id}>
          <CardContent className="flex items-center justify-between pt-6">
            <div>
              <p className="font-medium">
                {file.file_name}
              </p>

              <p className="text-xs text-muted-foreground">
                {formatFileSize(
                  file.file_size
                )}
              </p>
            </div>

            <Button
              asChild
              size="sm"
              variant="outline"
            >
              <Link
                href={file.file_url}
                target="_blank"
              >
                Download
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}