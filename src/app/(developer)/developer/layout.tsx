import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { developerNav } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DeveloperLayout({
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

  if (profile.role?.toUpperCase() !== "DEVELOPER") {
    redirect("/client");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar
        title="Zaynex Developer"
        items={developerNav}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          title="Developer Dashboard"
          sidebar={
            <MobileSidebar
              title="Zaynex Developer"
              items={developerNav}
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