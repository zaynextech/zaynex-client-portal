import Link from "next/link";
import {
  FileText,
  FileCode,
  FileBadge,
  Receipt,
  Palette,
  FolderKanban,
  Download,
  ExternalLink,
  HardDrive,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
} from "lucide-react";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const categories = [
  {
    key: "SOURCE_CODE",
    title: "Source Files & Code",
    icon: FileCode,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
  },
  {
    key: "DESIGN",
    title: "Design Assets & UI",
    icon: Palette,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  {
    key: "DOCUMENT",
    title: "Technical Documentation",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  {
    key: "CONTRACT",
    title: "Contracts & SOWs",
    icon: FileBadge,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  {
    key: "INVOICE",
    title: "Invoices & Settlement",
    icon: Receipt,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
] as const;

function getFileExtension(filename: string) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()?.toUpperCase() : "FILE";
}

export default async function DeveloperFilesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // 1. Get projects assigned to this developer
  const { data: memberships, error: membershipError } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("user_id", user.id);

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  const projectIds = (memberships ?? []).map(
    (membership) => membership.project_id
  );

  // Empty state: no project memberships
  if (projectIds.length === 0) {
    return (
      <PageContainer>
        <PageHeader
          title="Project File Repository"
          description="Access technical specs, design assets, and code exports from your assigned projects."
        />

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FolderKanban className="h-6 w-6" />
          </div>
          <p className="mt-4 text-base font-bold tracking-tight text-foreground">
            No Projects Assigned
          </p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground sm:text-sm">
            Files will automatically appear here once you are assigned to an active project workspace.
          </p>
        </div>
      </PageContainer>
    );
  }

  // 2. Fetch all files from assigned projects
  const { data: files, error: filesError } = await supabase
    .from("project_files")
    .select(`
      id,
      project_id,
      file_name,
      file_url,
      category,
      uploaded_by_role,
      created_at,
      project:projects (
        id,
        name
      )
    `)
    .in("project_id", projectIds)
    .order("created_at", { ascending: false });

  if (filesError) {
    throw new Error(filesError.message);
  }

  const fileList = (files ?? []).map((file) => ({
    ...file,
    project: Array.isArray(file.project)
      ? file.project[0] ?? null
      : file.project,
  }));

  const totalFiles = fileList.length;
  const sourceCodeCount = fileList.filter((f) => f.category === "SOURCE_CODE").length;
  const designCount = fileList.filter((f) => f.category === "DESIGN").length;
  const docCount = fileList.filter((f) => f.category === "DOCUMENT").length;

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="Project File Repository"
        description="Browse, preview, and download technical deliverables, design components, and workspace files."
      />

      {/* Telemetry Overview Strip */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Total Repository Files */}
        <div className="rounded-xl border border-border/70 bg-card p-4.5 shadow-xs transition-all hover:border-primary/40 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Assets
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HardDrive className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {totalFiles}
            </p>
            <span className="text-xs font-medium text-muted-foreground">Files</span>
          </div>
        </div>

        {/* Source Code Files */}
        <div className="rounded-xl border border-border/70 bg-card p-4.5 shadow-xs transition-all hover:border-cyan-500/40 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Source Code
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
              <FileCode className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-cyan-600 dark:text-cyan-400 sm:text-3xl">
              {sourceCodeCount}
            </p>
            <span className="text-xs font-medium text-muted-foreground">Archives & Snippets</span>
          </div>
        </div>

        {/* Design Assets */}
        <div className="rounded-xl border border-border/70 bg-card p-4.5 shadow-xs transition-all hover:border-purple-500/40 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Design & UI
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Palette className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400 sm:text-3xl">
              {designCount}
            </p>
            <span className="text-xs font-medium text-muted-foreground">UI Deliverables</span>
          </div>
        </div>

        {/* Documentation */}
        <div className="rounded-xl border border-border/70 bg-card p-4.5 shadow-xs transition-all hover:border-blue-500/40 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Documents
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400 sm:text-3xl">
              {docCount}
            </p>
            <span className="text-xs font-medium text-muted-foreground">Specs & Briefs</span>
          </div>
        </div>
      </div>

      {/* Categorized File Collections */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryFiles = fileList.filter(
            (file) => file.category === category.key
          );

          if (categoryFiles.length === 0) {
            return null;
          }

          const Icon = category.icon;

          return (
            <SectionCard
              key={category.key}
              title={`${category.title} (${categoryFiles.length})`}
              action={
                <Badge
                  variant="secondary"
                  className="rounded-md px-2 py-0.5 text-xs font-semibold"
                >
                  {categoryFiles.length} {categoryFiles.length === 1 ? "File" : "Files"}
                </Badge>
              }
            >
              <div className="grid grid-cols-1 gap-3">
                {categoryFiles.map((file) => {
                  const ext = getFileExtension(file.file_name);
                  const isUploadedByAdmin = file.uploaded_by_role === "ADMIN";

                  return (
                    <div
                      key={file.id}
                      className="group flex flex-col justify-between gap-4 rounded-xl border border-border/70 bg-card p-4 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm md:flex-row md:items-center"
                    >
                      {/* Left: Icon, Details & Metadata */}
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${category.bgColor} ${category.color} border ${category.borderColor}`}
                        >
                          <Icon className="h-4.5 w-4.5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          {/* File Name & Extension */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="truncate text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-base">
                              {file.file_name}
                            </span>
                            <Badge
                              variant="outline"
                              className="font-mono text-[10px] font-bold uppercase text-muted-foreground"
                            >
                              {ext}
                            </Badge>
                          </div>

                          {/* Contextual Chips */}
                          <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                            {/* Project Chip */}
                            {file.project?.name && (
                              <Link
                                href={`/developer/projects/${file.project_id}`}
                                className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-foreground/85 transition-colors hover:bg-muted hover:text-foreground"
                              >
                                <FolderKanban className="h-3 w-3 text-primary" />
                                <span className="truncate max-w-35">
                                  {file.project.name}
                                </span>
                                <ArrowUpRight className="h-2.5 w-2.5 opacity-60" />
                              </Link>
                            )}

                            {/* Uploader Role */}
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold uppercase ${
                                isUploadedByAdmin
                                  ? "border-primary/30 bg-primary/5 text-primary"
                                  : "border-muted-foreground/30 text-muted-foreground"
                              }`}
                            >
                              {file.uploaded_by_role || "ADMIN"}
                            </Badge>

                            {/* Timestamp */}
                            <span className="flex items-center gap-1 text-[11px]">
                              <Calendar className="h-3 w-3 text-muted-foreground/70" />
                              <span suppressHydrationWarning>
                                {new Date(file.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-3 shrink-0 md:border-0 md:pt-0">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 text-xs font-medium shadow-xs"
                        >
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                            Preview
                          </a>
                        </Button>

                        <Button
                          asChild
                          size="sm"
                          className="h-8 gap-1.5 text-xs font-medium shadow-xs"
                        >
                          <a
                            href={file.file_url}
                            download={file.file_name}
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </a>
                        </Button>

                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                          <Link href={`/developer/projects/${file.project_id}`}>
                            <Layers className="h-3.5 w-3.5" />
                            Workspace
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          );
        })}

        {/* Global Empty State */}
        {fileList.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="mt-4 text-base font-bold tracking-tight text-foreground">
              No Files Uploaded Yet
            </p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground sm:text-sm">
              Deliverables, contracts, and design assets uploaded to your assigned projects will be indexed here.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}