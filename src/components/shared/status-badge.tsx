import { Badge } from "@/components/ui/badge";

interface Props {
  status: string;
}

export function StatusBadge({ status }: Props) {
  return (
    <Badge variant="secondary">
      {status}
    </Badge>
  );
}