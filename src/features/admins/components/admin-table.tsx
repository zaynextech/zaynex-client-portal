"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import {
  updateUserRole,
  type UserRole,
} from "@/features/admins/actions";

import { Button } from "@/components/ui/button";

const SUPER_ADMIN_EMAIL = "gkasmiro@gmail.com";

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
}

interface AdminTableProps {
  users: Profile[];
}

const roles: {
  value: UserRole;
  label: string;
}[] = [
  {
    value: "ADMIN",
    label: "Admin",
  },
  {
    value: "DEVELOPER",
    label: "Developer",
  },
  {
    value: "SELLER",
    label: "Seller",
  },
  {
    value: "CLIENT",
    label: "Client",
  },
];

export function AdminTable({
  users,
}: AdminTableProps) {
  const [pending, startTransition] =
    useTransition();

  const handleRoleChange = (
    userId: string,
    role: UserRole
  ) => {
    startTransition(async () => {
      try {
        await updateUserRole(userId, role);

        toast.success(
          `User role changed to ${role}`
        );

        window.location.reload();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update role"
        );
      }
    });
  };

  return (
    <div className="rounded-xl border">
      <div className="border-b p-4">
        <h2 className="font-semibold">
          User Role Management
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage administrator, developer, seller,
          and client access.
        </p>
      </div>

      <div className="divide-y">
        {users.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No users found.
          </div>
        ) : (
          users.map((user) => {
            const isSuperAdmin =
              user.email === SUPER_ADMIN_EMAIL;

            const currentRole =
              user.role?.toUpperCase() || "CLIENT";

            return (
              <div
                key={user.id}
                className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between"
              >
                {/* USER */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">
                      {user.full_name || "Unnamed"}
                    </p>

                    {isSuperAdmin && (
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        Super Admin
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>

                {/* ROLE CONTROLS */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border px-2.5 py-1.5 text-xs font-medium">
                    {currentRole}
                  </span>

                  {!isSuperAdmin && (
                    <div className="flex flex-wrap gap-2">
                      {roles
                        .filter(
                          (role) =>
                            role.value !== currentRole
                        )
                        .map((role) => (
                          <Button
                            key={role.value}
                            size="sm"
                            variant="outline"
                            disabled={pending}
                            onClick={() =>
                              handleRoleChange(
                                user.id,
                                role.value
                              )
                            }
                          >
                            Make {role.label}
                          </Button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}