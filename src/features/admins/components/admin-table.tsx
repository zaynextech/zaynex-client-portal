"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import {
  makeAdmin,
  removeAdmin,
} from "@/features/admins/actions";

import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
}

interface AdminTableProps {
  admins: Profile[];
  clients: Profile[];
}

export function AdminTable({
  admins,
  clients,
}: AdminTableProps) {
  const [pending, startTransition] =
    useTransition();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ADMINS */}
      <div className="rounded-xl border">
        <div className="border-b p-4">
          <h2 className="font-semibold">
            Administrators
          </h2>
        </div>

        <div className="divide-y">
          {admins.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No admins found.
            </div>
          ) : (
            admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-medium">
                    {admin.full_name ||
                      "Unnamed"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {admin.email}
                  </p>
                </div>

                {admin.email !==
                  "gkasmiro@gmail.com" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={pending}
                    onClick={() => {
                      startTransition(
                        async () => {
                          try {
                            await removeAdmin(
                              admin.id
                            );

                            toast.success(
                              "Admin removed"
                            );

                            window.location.reload();
                          } catch {
                            toast.error(
                              "Failed to remove admin"
                            );
                          }
                        }
                      );
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* CLIENTS */}
      <div className="rounded-xl border">
        <div className="border-b p-4">
          <h2 className="font-semibold">
            Clients
          </h2>
        </div>

        <div className="divide-y">
          {clients.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No clients found.
            </div>
          ) : (
            clients.map((client) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-medium">
                    {client.full_name ||
                      "Unnamed"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {client.email}
                  </p>
                </div>

                <Button
                  size="sm"
                  disabled={pending}
                  onClick={() => {
                    startTransition(
                      async () => {
                        try {
                          await makeAdmin(
                            client.id
                          );

                          toast.success(
                            "Admin added"
                          );

                          window.location.reload();
                        } catch {
                          toast.error(
                            "Failed to add admin"
                          );
                        }
                      }
                    );
                  }}
                >
                  Make Admin
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}