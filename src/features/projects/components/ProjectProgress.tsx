"use client";

interface ProjectProgressProps {
  progress: number;
}

export function ProjectProgress({
  progress,
}: ProjectProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>

      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}