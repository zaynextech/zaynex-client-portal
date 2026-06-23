import Link from "next/link";

import {
  FileText,
  FileCode,
  FileBadge,
  Receipt,
  Palette,
} from "lucide-react";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { createClient } from "@/lib/supabase/server";

import { DeleteProjectFileButton } from "@/features/projects/components/delete-project-file-button";

const categories = [
  {
    key: "CONTRACT",
    title: "Contracts",
    icon: FileBadge,
  },
  {
    key: "DESIGN",
    title: "Design Files",
    icon: Palette,
  },
  {
    key: "SOURCE_CODE",
    title: "Source Files",
    icon: FileCode,
  },
  {
    key: "DOCUMENT",
    title: "Documents",
    icon: FileText,
  },
  {
    key: "INVOICE",
    title: "Invoices",
    icon: Receipt,
  },
] as const;

export default async function AdminFilesPage() {
  const supabase =
    await createClient();

  const { data: files } =
    await supabase
      .from("project_files")
      .select(`
        *,
        project:projects(
          id,
          name
        )
      `)
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  return (
    <PageContainer>
      <PageHeader
        title="Files"
        description="Manage all project files"
      />

      <div className="space-y-6">
        {categories.map(
          (category) => {
            const categoryFiles =
              files?.filter(
                (file) =>
                  file.category ===
                  category.key
              ) ?? [];

            if (
              categoryFiles.length === 0
            ) {
              return null;
            }

            const Icon =
              category.icon;

            return (
              <SectionCard
                key={category.key}
                title={`${category.title} (${categoryFiles.length})`}
              >
                <div className="space-y-4">
                  {categoryFiles.map(
                    (file) => (
                      <div
                        key={file.id}
                        className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="mt-1 h-5 w-5 text-muted-foreground" />

                          <div>
                            <p className="font-medium">
                              {file.file_name}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              {file.project
                                ?.name ??
                                "Unknown Project"}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              Uploaded by:{" "}
                              {file.uploaded_by_role ??
                                "ADMIN"}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                file.created_at
                              ).toLocaleDateString(
                                "en-GB"
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <a
                            href={
                              file.file_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md border px-3 py-2 text-sm"
                          >
                            Preview
                          </a>

                          <a
                            href={
                              file.file_url
                            }
                            download={
                              file.file_name
                            }
                            className="rounded-md border px-3 py-2 text-sm"
                          >
                            Download
                          </a>

                          <Link
                            href={`/admin/projects/${file.project_id}`}
                            className="rounded-md border px-3 py-2 text-sm"
                          >
                            Project
                          </Link>

                          <DeleteProjectFileButton
                            fileId={
                              file.id
                            }
                            projectId={
                              file.project_id
                            }
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </SectionCard>
            );
          }
        )}

        {!files?.length && (
          <SectionCard title="Files">
            <p className="text-muted-foreground">
              No files found.
            </p>
          </SectionCard>
        )}
      </div>
    </PageContainer>
  );
}