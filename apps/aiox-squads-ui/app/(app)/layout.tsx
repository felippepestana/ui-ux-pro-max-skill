import { Sidebar } from "@/components/app-shell/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-screen-2xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
