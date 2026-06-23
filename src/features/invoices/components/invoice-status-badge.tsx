import { Badge } from "@/components/ui/badge";

export function InvoiceStatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <Badge variant="outline">
      {status}
    </Badge>
  );
}