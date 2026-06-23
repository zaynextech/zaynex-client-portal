"use client";

import Link from "next/link";

import {
  AlertTriangle,
  Clock3,
  CalendarDays,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  due_date: string | null;
  progress: number | null;
  status: string;
}

interface Props {
  projects: Project[];
}

export function UpcomingDeadlines({
  projects,
}: Props) {
  const today = new Date();

  const upcomingProjects =
    projects
      .filter(
        (project) =>
          project.due_date
      )
      .map((project) => {
        const dueDate =
          new Date(
            project.due_date!
          );

        const diffDays =
          Math.ceil(
            (dueDate.getTime() -
              today.getTime()) /
              (1000 *
                60 *
                60 *
                24)
          );

        return {
          ...project,
          diffDays,
        };
      })
      .sort(
        (a, b) =>
          a.diffDays -
          b.diffDays
      )
      .slice(0, 10);

  return (
    <div className="space-y-3">
      {upcomingProjects.length ===
      0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No upcoming
          deadlines.
        </div>
      ) : (
        upcomingProjects.map(
          (project) => {
            const overdue =
              project.diffDays < 0;

            const dueToday =
              project.diffDays ===
              0;

            const dueSoon =
              project.diffDays >
                0 &&
              project.diffDays <=
                7;

            return (
              <Link
                key={
                  project.id
                }
                href={`/admin/projects/${project.id}`}
                className="block rounded-xl border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium">
                      {
                        project.name
                      }
                    </h4>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {
                        project.status
                      }
                    </p>
                  </div>

                  {overdue && (
                    <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-500">
                      <AlertTriangle className="h-3 w-3" />
                      Overdue
                    </span>
                  )}

                  {dueToday && (
                    <span className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-1 text-xs text-orange-500">
                      <Clock3 className="h-3 w-3" />
                      Today
                    </span>
                  )}

                  {dueSoon && (
                    <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-500">
                      <CalendarDays className="h-3 w-3" />
                      {project.diffDays}
                      d
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs">
                    <span>
                      Progress
                    </span>

                    <span>
                      {project.progress ??
                        0}
                      %
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${
                          project.progress ??
                          0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  Due:{" "}
                  {project.due_date
                    ? new Date(
                        project.due_date
                      ).toLocaleDateString(
                        "en-US"
                      )
                    : "-"}
                </div>
              </Link>
            );
          }
        )
      )}
    </div>
  );
}