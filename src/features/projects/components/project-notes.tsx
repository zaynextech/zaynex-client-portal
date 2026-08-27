// src/features/projects/components/project-notes.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, SendHorizontal, Lock, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createProjectNote } from "@/features/projects/actions/create-project-note";

interface Props {
  projectId: string;
}

// Ensure this has 'export function ProjectNotes', NOT 'export default function'
export function ProjectNotes({ projectId }: Props) {
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit() {
    const trimmedNote = note.trim();

    if (!trimmedNote) {
      toast.error("Please enter a note before submitting.");
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("projectId", projectId);
        formData.append("note", trimmedNote);

        await createProjectNote(formData);

        toast.success("Note posted successfully");
        setNote("");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to post note. Please try again.");
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isPending && note.trim()) {
        handleSubmit();
      }
    }
  }

  return (
    <Card className="border-border/60 bg-card text-card-foreground shadow-sm">
      <CardHeader className="space-y-1.5 border-b border-border/40 pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
              Internal Project Notes
            </CardTitle>
          </div>

          <Badge
            variant="secondary"
            className="flex items-center gap-1 font-medium text-muted-foreground"
          >
            <Lock className="h-3 w-3" />
            Team Only
          </Badge>
        </div>

        <CardDescription className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Keep track of decisions, action items, and technical context.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 pb-3">
        <div className="space-y-3">
          <div className="relative rounded-lg border border-border/80 bg-background/50 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 transition-all">
            <Textarea
              placeholder="Write a note... (Markdown supported)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
              rows={4}
              className="min-h-30 w-full resize-y border-0 bg-transparent p-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <div className="flex items-center justify-between border-t border-border/30 px-3 py-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                Supports standard Markdown
              </span>
              <span className="hidden items-center gap-1 sm:inline-flex">
                Press <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px] text-foreground">⌘</kbd> + <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px] text-foreground">Enter</kbd> to post
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col-reverse gap-3 border-t border-border/40 pt-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Notes are timestamped and attributed to your account.
        </p>

        <Button
          onClick={handleSubmit}
          disabled={isPending || !note.trim()}
          size="sm"
          className="w-full gap-1.5 font-medium shadow-sm sm:w-auto"
        >
          {isPending ? (
            "Posting..."
          ) : (
            <>
              Post Note
              <SendHorizontal className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}