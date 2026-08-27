import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  FolderKanban,
  ArrowRight,
  Clock,
} from "lucide-react";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function ClientProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      client:profiles(
        id,
        full_name,
        email
      )
    `)
    .eq("client_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  return (
    <PageContainer>
      <PageHeader
        title="My Projects"
        description="Track active milestones, deliverables, timelines, and progress updates in real time."
      />

      {projects?.length ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project) => {
            const progress = project.progress ?? 0;

            const formattedStartDate = project.start_date
              ? new Date(project.start_date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—";

            const formattedDueDate = project.due_date
              ? new Date(project.due_date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—";

            return (
              <Card
                key={project.id}
                className="group flex flex-col justify-between border-border/60 bg-card text-card-foreground shadow-xs transition-all duration-200 hover:border-border hover:shadow-md"
              >
                {/* Card Header */}
                <CardHeader className="space-y-2 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <FolderKanban className="h-4 w-4" />
                      </div>
                      <CardTitle className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
                        {project.name}
                      </CardTitle>
                    </div>

                    <Badge
                      variant="outline"
                      className="shrink-0 border-primary/30 bg-primary/5 text-[11px] font-semibold uppercase tracking-wider text-primary"
                    >
                      {project.status}
                    </Badge>
                  </div>

                  {project.description && (
                    <CardDescription className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>

                {/* Card Body / Metrics */}
                <CardContent className="space-y-4 pb-4">
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-muted-foreground">
                        Completion
                      </span>
                      <span className="font-semibold tabular-nums text-foreground">
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Dates & Metadata Grid */}
                  <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                        <Clock className="h-3 w-3 text-muted-foreground/70" />
                        Start Date
                      </div>
                      <p className="mt-1 truncate text-xs font-semibold text-foreground">
                        {formattedStartDate}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                        <Calendar className="h-3 w-3 text-muted-foreground/70" />
                        Due Date
                      </div>
                      <p className="mt-1 truncate text-xs font-semibold text-foreground">
                        {formattedDueDate}
                      </p>
                    </div>
                  </div>
                </CardContent>

                {/* Card Footer */}
                <CardFooter className="border-t border-border/40 pt-3 pb-4">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-between gap-2 border-border/80 font-medium transition-all group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <Link href={`/client/projects/${project.id}`}>
                      <span>View Project Workspace</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FolderKanban className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground">
            No projects found
          </h3>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
            You don&apos;t have any active projects assigned yet. Once your project is created, it will appear here.
          </p>
        </div>
      )}
    </PageContainer>
  );
}