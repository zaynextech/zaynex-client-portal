"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

interface TaskCommentFormProps {
  taskId: string;
}

interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  profiles?: {
    full_name?: string | null;
    email?: string | null;
  } | {
    full_name?: string | null;
    email?: string | null;
  }[] | null;
}

interface TaskCommentsProps {
  comments: TaskComment[];
  currentUserId: string;
}

export function TaskCommentForm({
  taskId,
}: TaskCommentFormProps) {
  const router = useRouter();

  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedComment = comment.trim();

    if (!trimmedComment) return;

    try {
      setSubmitting(true);

      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be logged in.");
      }

      const { error } = await supabase
        .from("task_comments")
        .insert({
          task_id: taskId,
          user_id: user.id,
          comment: trimmedComment,
        });

      if (error) {
        throw new Error(error.message);
      }

      setComment("");

      toast.success("Comment added");

      router.refresh();
    } catch (error) {
      console.error("Failed to add comment:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add comment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 space-y-3"
    >
      <Textarea
        value={comment}
        onChange={(event) =>
          setComment(event.target.value)
        }
        placeholder="Write a comment or note..."
        rows={4}
        disabled={submitting}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting || !comment.trim()}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Add Comment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function TaskCommentList({
  comments,
  currentUserId,
}: TaskCommentsProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(
    null
  );

  async function handleDelete(commentId: string) {
    try {
      setDeletingId(commentId);

      const supabase = createClient();

      const { error } = await supabase
        .from("task_comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", currentUserId);

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Comment deleted");

      router.refresh();
    } catch (error) {
      console.error("Failed to delete comment:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete comment."
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (comments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center">
        <p className="font-medium">No comments yet</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Communication about this task will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => {
        const profile = Array.isArray(comment.profiles)
          ? comment.profiles[0]
          : comment.profiles;

        const isDeleting = deletingId === comment.id;

        return (
          <div
            key={comment.id}
            className="rounded-xl border bg-muted/20 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {profile?.full_name ?? "Team Member"}
                </p>

                {profile?.email && (
                  <p className="text-xs text-muted-foreground">
                    {profile.email}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <p
                  suppressHydrationWarning
                  className="text-xs text-muted-foreground"
                >
                  {new Date(
                    comment.created_at
                  ).toLocaleString()}
                </p>

                {comment.user_id === currentUserId && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    disabled={isDeleting}
                    onClick={() =>
                      handleDelete(comment.id)
                    }
                    title="Delete comment"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground/85">
              {comment.comment}
            </p>
          </div>
        );
      })}
    </div>
  );
}