import { Scale } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_minmax(420px,520px)]">
      <aside
        className="relative hidden bg-[var(--primary)] text-[var(--primary-foreground)] lg:flex lg:flex-col lg:justify-between lg:p-12"
        aria-hidden
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
            <Scale className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl">aiox-squads</span>
        </div>
        <div className="max-w-md space-y-6">
          <p className="font-serif text-3xl leading-tight">
            “Squads de agentes IA cuidam do operacional. Você foca na tese.”
          </p>
          <div className="flex items-center gap-3 text-sm text-white/80">
            <span className="h-px flex-1 bg-white/20" />
            <span>Legal Intelligence Platform</span>
            <span className="h-px flex-1 bg-white/20" />
          </div>
        </div>
        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} aiox-squads · LGPD ready
        </p>
      </aside>

      <main className="flex items-center justify-center bg-[var(--background)] p-6 sm:p-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
