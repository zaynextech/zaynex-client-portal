interface TicketMessageProps {
  author: string;
  message: string;
}

export function TicketMessage({
  author,
  message,
}: TicketMessageProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="font-medium">
        {author}
      </p>

      <p className="text-muted-foreground mt-2">
        {message}
      </p>
    </div>
  );
}