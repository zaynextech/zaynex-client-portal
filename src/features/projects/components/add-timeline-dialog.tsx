"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { addTimelineEntry } from "@/features/projects/actions/add-timeline-entry";

interface AddTimelineDialogProps {
  projectId: string;
}

export function AddTimelineDialog({
  projectId,
}: AddTimelineDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState("PENDING");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await addTimelineEntry({
        project_id: projectId,
        title,
        description,
        status,
      });

      toast.success(
        "Timeline entry added"
      );

      setOpen(false);

      setTitle("");
      setDescription("");
      setStatus("PENDING");

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to add timeline entry"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          Add Timeline Entry
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Timeline Entry
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />

          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="PENDING">
              Pending
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="COMPLETED">
              Completed
            </option>
          </select>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : "Add Entry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}