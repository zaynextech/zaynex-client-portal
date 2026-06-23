import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

import { clientNav } from "@/lib/client-navigation";
import { createClient } from "@/lib/supabase/server";


export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } =
    await supabase
      .from("profiles")
      .select(
        "role, status"
      )
      .eq("id", user.id)
      .single();

  if (!profile) {
    redirect("/auth/login");
  }

  if (
    profile.status ===
    "FROZEN"
  ) {
    redirect("/suspended");
  }

  if (
    profile.role !==
    "CLIENT"
  ) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        title="Client Portal"
        items={clientNav}
      />

      <div className="flex flex-1 flex-col">
        <AppHeader
          title="Client Portal"
          sidebar={
            <MobileSidebar
              title="Client Portal"
              items={clientNav}
            />
          }
        />

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}