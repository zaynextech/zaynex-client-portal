import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <h3 className="text-3xl font-bold mt-1">{value}</h3>
            {description && (
              <p className="text-muted-foreground text-xs mt-2">
                {description}
              </p>
            )}
          </div>

          {icon && <div>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  );
}