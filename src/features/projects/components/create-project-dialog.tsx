"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ProjectForm } from "./project-form";

import { createProject } from "@/features/projects/actions/create-project";

interface Client {
  id: string;
  full_name: string | null;
  email: string;
}

interface CreateProjectDialogProps {
  clients: Client[];
}

export function CreateProjectDialog({
  clients,
}: CreateProjectDialogProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleCreateProject = async (
    data: {
      client_id: string;
      name: string;
      description: string;
      budget: number;
      start_date: string;
      due_date: string;
    }
  ) => {
    try {
      await createProject(data);

      toast.success(
        "Project created successfully"
      );

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to create project"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          New Project
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Create Project
          </DialogTitle>
        </DialogHeader>

        <ProjectForm
          clients={clients}
          onSubmit={handleCreateProject}
        />
      </DialogContent>
    </Dialog>
  );
}