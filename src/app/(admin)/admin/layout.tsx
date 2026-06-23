import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

import { adminNav } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/server";


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/auth/login");
  }

  if (profile.role !== "ADMIN") {
    redirect("/client");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* 
        The Framer Motion sidebar manages its width dynamically (72px to 256px). 
        h-full ensures it stretches the absolute length of the viewport.
      */}
      <AppSidebar
        title="Zaynex Admin"
        items={adminNav}
      />

      {/* Primary content area container */}
      <div className="flex flex-1 flex-col min-w-0 h-full">
        <AppHeader
          title="Admin Dashboard"
          sidebar={
            <MobileSidebar
              title="Zaynex Admin"
              items={adminNav}
            />
          }
        />

        {/* 
          Main internal scroll field. Added standard padding (p-4 md:p-6) 
          so view pages look consistently professional out of the box.
        */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}