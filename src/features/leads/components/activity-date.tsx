"use client";

type Props = {
  date: string;
};

export function ActivityDate({ date }: Props) {
  return (
    <span
      className="text-xs text-muted-foreground"
      suppressHydrationWarning
    >
      {new Date(date).toLocaleString()}
    </span>
  );
}