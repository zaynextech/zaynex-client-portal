import { Badge } from "@/components/ui/badge";

export function ProjectStatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <Badge variant="secondary">
      {status}
    </Badge>
  );
}