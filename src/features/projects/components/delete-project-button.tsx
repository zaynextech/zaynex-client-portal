"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { deleteProject } from "@/features/projects/actions/delete-project";

interface DeleteProjectButtonProps {
  projectId: string;
}

export function DeleteProjectButton({
  projectId,
}: DeleteProjectButtonProps) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteProject(
        projectId
      );

      toast.success(
        "Project deleted successfully"
      );

      setOpen(false);

      router.push(
        "/admin/projects"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete project"
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
        <Button variant="destructive">
          Delete Project
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Project
          </DialogTitle>

          <DialogDescription>
            Are you sure you want to
            delete this project?
            This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}