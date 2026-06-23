import { Badge } from "@/components/ui/badge";

export function TicketStatusBadge({
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