"use client";

import { useState } from "react";

import { Plus } from "lucide-react";
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

import { createProjectTask } from "@/features/projects/actions/create-project-task";

interface Props {
  projectId: string;
}

export function CreateProjectTaskDialog({
  projectId,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  async function handleSubmit() {
    if (!title.trim()) {
      toast.error(
        "Task title is required"
      );
      return;
    }

    try {
      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "projectId",
        projectId
      );

      formData.append(
        "title",
        title
      );

      formData.append(
        "description",
        description
      );

      await createProjectTask(
        formData
      );

      toast.success(
        "Task created"
      );

      setTitle("");
      setDescription("");

      setOpen(false);

      location.reload();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create task"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            rows={4}
          />

          <Button
            className="w-full"
            disabled={
              loading ||
              !title.trim()
            }
            onClick={
              handleSubmit
            }
          >
            {loading
              ? "Creating..."
              : "Create Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}