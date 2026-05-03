import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SquadRunPipeline } from "@/components/squads/squad-run-pipeline";
import { getSquadIcon } from "@/lib/squad-icons";
import { getSquadById, SQUADS } from "@/lib/squads";

export function generateStaticParams() {
  return SQUADS.map((squad) => ({ id: squad.id }));
}

export default async function SquadRunPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const squad = getSquadById(id);
  if (!squad) notFound();

  const Icon = getSquadIcon(squad.iconKey);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/squads/${squad.id}` as Route}
        className="inline-flex w-fit items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> {squad.name}
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[var(--surface-primary)] text-[var(--primary)]"
            aria-hidden
          >
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
              Execução ao vivo
            </p>
            <h1 className="mt-1 font-serif text-3xl">{squad.name}</h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {squad.tagline}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Run #demo</Badge>
          <Badge variant="default">SSE simulada (mock)</Badge>
        </div>
      </header>

      <SquadRunPipeline squad={squad} />
    </div>
  );
}
