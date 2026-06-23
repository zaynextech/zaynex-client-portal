import { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function SectionCard({
  title,
  children,
  action,
}: SectionCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>
          {title}
        </CardTitle>

        {action}
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}