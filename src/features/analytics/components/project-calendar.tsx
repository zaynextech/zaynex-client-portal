"use client";

import { useMemo, useState } from "react";

import { DayPicker } from "react-day-picker";

import "react-day-picker/dist/style.css";

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number | null;
  due_date: string | null;
  client?:
    | {
        full_name: string | null;
      }[]
    | null;
}

interface Props {
  projects: Project[];
}

function getDateKey(
  date: string | Date
) {
  const d = new Date(date);

  const year =
    d.getFullYear();

  const month = String(
    d.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    d.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function ProjectCalendar({
  projects,
}: Props) {
  const [selectedDate, setSelectedDate] =
    useState<Date>(
      new Date()
    );

  const projectsByDate =
    useMemo(() => {
      const map = new Map<
        string,
        Project[]
      >();

      projects.forEach(
        (project) => {
          if (
            !project.due_date
          ) {
            return;
          }

          const key =
            getDateKey(
              project.due_date
            );

          const existing =
            map.get(key) ?? [];

          existing.push(
            project
          );

          map.set(
            key,
            existing
          );
        }
      );

      return map;
    }, [projects]);

  const dueDates =
    projects
      .filter(
        (p) => p.due_date
      )
      .map((p) => {
        const d = new Date(
          p.due_date!
        );

        return new Date(
          d.getFullYear(),
          d.getMonth(),
          d.getDate()
        );
      });

  const selectedProjects =
    projectsByDate.get(
      getDateKey(
        selectedDate
      )
    ) ?? [];

    

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <div className="rounded-xl border p-4">
        <DayPicker
          mode="single"
          selected={
            selectedDate
          }
          onSelect={(date) =>
            date &&
            setSelectedDate(
              date
            )
          }
          modifiers={{
            due: dueDates,
          }}
          modifiersClassNames={{
            due: "bg-primary text-primary-foreground rounded-full",
          }}
        />

        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-primary" />
            Project Deadline
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="mb-4 font-semibold">
          {selectedDate.toLocaleDateString(
            "en-US",
            {
              weekday:
                "long",
              year: "numeric",
              month:
                "long",
              day: "numeric",
            }
          )}
        </h3>

        {selectedProjects.length ===
          0 && (
          <p className="text-sm text-muted-foreground">
            No project
            deadlines on
            this date.
          </p>
        )}

        <div className="space-y-3">
          {selectedProjects.map(
            (project) => (
              <div
                key={
                  project.id
                }
                className="rounded-xl border p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-medium">
                    {
                      project.name
                    }
                  </h4>

                  <span className="rounded-md border px-2 py-1 text-xs">
                    {
                      project.status
                    }
                  </span>
                </div>

                <div className="mt-2 text-sm text-muted-foreground">
                  Client:
                  {" "}
                  {project
                    .client?.[0]
                    ?.full_name ??
                    "Unknown"}
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  Due:
                  {" "}
                  {project.due_date
                    ? new Date(
                        project.due_date
                      ).toLocaleDateString(
                        "en-US",
                        {
                          year:
                            "numeric",
                          month:
                            "short",
                          day:
                            "numeric",
                        }
                      )
                    : "-"}
                </div>

                <div className="mt-4">
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
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{
                        width: `${
                          project.progress ??
                          0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}