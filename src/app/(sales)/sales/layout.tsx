import { redirect } from "next/navigation";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { salesNav } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function SalesLayout({
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

  const role = profile.role?.toUpperCase();

  if (role !== "SELLER") {
    if (role === "ADMIN") {
      redirect("/admin");
    }

    if (role === "DEVELOPER") {
      redirect("/developer");
    }

    redirect("/client");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar
        title="Zaynex Sales"
        items={salesNav}
      />

      <div className="flex min-w-0 h-full flex-1 flex-col">
        <AppHeader
          title="Sales Dashboard"
          sidebar={
            <MobileSidebar
              title="Zaynex Sales"
              items={salesNav}
            />
          }
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}