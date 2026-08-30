import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Video,
  FileArchive,
  File,
  ExternalLink,
  Calendar,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function getFileMeta(url?: string | null) {
  if (!url) {
    return {
      ext: "FILE",
      icon: File,
      color: "text-muted-foreground bg-muted/60 border-border/50",
      badgeClass: "bg-muted text-muted-foreground",
    };
  }

  const cleanUrl = url.split("?")[0].split("#")[0];
  const ext = cleanUrl.split(".").pop()?.toLowerCase() || "";

  switch (ext) {
    case "pdf":
      return {
        ext: "PDF",
        icon: FileText,
        color: "text-red-500 bg-red-500/10 border-red-500/20",
        badgeClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      };
    case "doc":
    case "docx":
    case "txt":
    case "rtf":
      return {
        ext: ext.toUpperCase(),
        icon: FileText,
        color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      };
    case "xls":
    case "xlsx":
    case "csv":
      return {
        ext: ext.toUpperCase(),
        icon: FileSpreadsheet,
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    case "ppt":
    case "pptx":
    case "key":
      return {
        ext: ext.toUpperCase(),
        icon: Presentation,
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
        badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    case "png":
    case "jpg":
    case "jpeg":
    case "webp":
    case "svg":
      return {
        ext: ext.toUpperCase(),
        icon: ImageIcon,
        color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      };
    case "mp4":
    case "mov":
    case "avi":
    case "webm":
      return {
        ext: ext.toUpperCase(),
        icon: Video,
        color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
        badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      };
    case "zip":
    case "rar":
    case "7z":
    case "tar":
      return {
        ext: ext.toUpperCase(),
        icon: FileArchive,
        color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
        badgeClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      };
    default:
      return {
        ext: ext.toUpperCase() || "FILE",
        icon: File,
        color: "text-primary bg-primary/10 border-primary/20",
        badgeClass: "bg-primary/10 text-primary border-primary/20",
      };
  }
}

export default async function SalesResourcesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: resources, error } = await supabase
    .from("resources")
    .select(`
      id,
      title,
      description,
      category,
      file_url,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "GET SALES RESOURCES ERROR:",
      JSON.stringify(error, null, 2)
    );
  }

  const groupedResources = (resources ?? []).reduce<
    Record<string, typeof resources>
  >((groups, resource) => {
    const category = resource.category || "Other";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(resource);

    return groups;
  }, {});

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Resources"
          description="Sales materials, guides, documents, and useful resources."
        />

        {Object.entries(groupedResources).map(([category, items]) => (
          <SectionCard
            key={category}
            title={`${category} (${items?.length ?? 0})`}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(items ?? []).map((resource) => {
                const meta = getFileMeta(resource.file_url);
                const Icon = meta.icon;

                return (
                  <div
                    key={resource.id}
                    className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  >
                    <div>
                      {/* Top Bar: Icon + Extension Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${meta.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] font-bold tracking-wider uppercase ${meta.badgeClass}`}
                        >
                          {meta.ext}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="mt-4 space-y-1.5">
                        <h3 className="line-clamp-1 font-semibold text-foreground group-hover:text-primary transition-colors">
                          {resource.title}
                        </h3>

                        {resource.description ? (
                          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {resource.description}
                          </p>
                        ) : (
                          <p className="text-xs italic text-muted-foreground/60">
                            No description provided.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom: Date + Action */}
                    <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="h-3 w-3" />
                        {new Date(resource.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>

                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                        className="h-8 gap-1.5 px-2.5 text-xs font-medium text-primary hover:bg-primary/10 hover:text-primary"
                      >
                        <a
                          href={resource.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span>Open</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        ))}

        {!resources?.length && (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <File className="h-6 w-6 text-muted-foreground" />
            </div>

            <p className="mt-4 font-semibold text-foreground">
              No resources available
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Resources uploaded by administrators will appear here.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}