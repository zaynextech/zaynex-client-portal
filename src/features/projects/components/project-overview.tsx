import { Card, CardContent } from "@/components/ui/card";

import { Project } from "../types";

interface Props {
  project: Project;
}

export function ProjectOverview({
  project,
}: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">
              Project
            </p>

            <p className="font-medium">
              {project.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Client
            </p>

            <p>
              {project.client?.full_name ||
                project.client?.email ||
                "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <p>{project.status}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Progress
            </p>

            <p>{project.progress}%</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Start Date
            </p>

            <p>
              {project.start_date
                ? new Date(
                    project.start_date
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Due Date
            </p>

            <p>
              {project.due_date
                ? new Date(
                    project.due_date
                  ).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-muted-foreground">
            Description
          </p>

          <p className="mt-2 leading-relaxed">
            {project.description ||
              "No description provided"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}