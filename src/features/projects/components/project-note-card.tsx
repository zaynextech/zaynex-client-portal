"use client";

import { useState } from "react";

import {
  Pin,
  Pencil,
  Trash2,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteProjectNote } from "@/features/projects/actions/delete-project-note";
import { updateProjectNote } from "@/features/projects/actions/update-project-note";
import { toggleProjectNotePin } from "@/features/projects/actions/toggle-project-note-pin";

interface Props {
  note: {
    id: string;
    note: string;
    pinned: boolean;
    created_at: string;
    profiles?:
      | {
          full_name: string;
        }
      | {
          full_name: string;
        }[]
      | null;
  };
}

export function ProjectNoteCard({
  note,
}: Props) {
  const [editing, setEditing] =
    useState(false);

  const [value, setValue] =
    useState(note.note);

  const fullName =
    Array.isArray(
      note.profiles
    )
      ? note.profiles[0]
          ?.full_name
      : note.profiles
          ?.full_name;

  async function handleSave() {
    await updateProjectNote(
      note.id,
      value
    );

    setEditing(false);

    location.reload();
  }

  async function handleDelete() {
    await deleteProjectNote(
      note.id
    );

    location.reload();
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        note.pinned
          ? "border-primary shadow-sm"
          : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              toggleProjectNotePin(
                note.id,
                note.pinned
              )
            }
          >
            <Pin
              className={`h-4 w-4 ${
                note.pinned
                  ? "fill-current"
                  : ""
              }`}
            />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              setEditing(
                !editing
              )
            }
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger
              asChild
            >
              <Button
                size="icon"
                variant="ghost"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete Note
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This action
                  cannot be
                  undone. The
                  note will be
                  permanently
                  removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={
                    handleDelete
                  }
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {note.pinned && (
          <span className="rounded-full border px-2 py-1 text-xs font-medium">
            📌 Pinned
          </span>
        )}
      </div>

      {editing ? (
        <>
          <Textarea
            value={value}
            onChange={(e) =>
              setValue(
                e.target.value
              )
            }
          />

          <Button
            className="mt-3"
            onClick={
              handleSave
            }
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </>
      ) : (
        <p className="whitespace-pre-wrap text-sm">
          {note.note}
        </p>
      )}

      <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">
        {fullName || "Admin"}
        {" • "}
        {new Date(
            note.created_at
        ).toLocaleString(
            "en-US",
            {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            }
        )}
        </div>
    </div>
  );
}