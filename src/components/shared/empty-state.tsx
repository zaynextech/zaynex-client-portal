import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && <div className="mb-4">{icon}</div>}

      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="text-muted-foreground mt-2 max-w-md">
        {description}
      </p>
    </div>
  );
}