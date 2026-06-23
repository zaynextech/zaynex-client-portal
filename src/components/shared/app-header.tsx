import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";

export function AppHeader() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <h2 className="font-semibold">
          Zaynex Portal
        </h2>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}