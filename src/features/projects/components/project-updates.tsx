interface Update {
  id: number;
  title: string;
  date: string;
}

export function ProjectUpdates({
  updates,
}: {
  updates: Update[];
}) {
  return (
    <div className="space-y-4">
      {updates.map((update) => (
        <div
          key={update.id}
          className="border-l-2 pl-4"
        >
          <h4 className="font-medium">
            {update.title}
          </h4>

          <p className="text-sm text-muted-foreground">
            {update.date}
          </p>
        </div>
      ))}
    </div>
  );
}