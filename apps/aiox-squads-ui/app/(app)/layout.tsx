import { CommandMenuProvider } from "@/components/app-shell/command-menu";
import { Sidebar } from "@/components/app-shell/sidebar";
import { Topbar } from "@/components/app-shell/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CommandMenuProvider>
      <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="min-w-0 flex-1">
            <div className="mx-auto max-w-screen-2xl px-8 py-8">{children}</div>
          </main>
        </div>
      </div>
    </CommandMenuProvider>
  );
}
