import { notFound } from "next/navigation";
import { ArrowRight, Coins, Sparkles, Timer, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSquadIcon } from "@/lib/squad-icons";
import { getSquadById, SQUADS } from "@/lib/squads";

export function generateStaticParams() {
  return SQUADS.map((squad) => ({ id: squad.id }));
}

export default async function SquadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const squad = getSquadById(id);
  if (!squad) notFound();

  const Icon = getSquadIcon(squad.iconKey);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
          Squad
        </p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <span
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[var(--surface-primary)] text-[var(--primary)]"
              aria-hidden
            >
              <Icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <h1 className="font-serif text-3xl">{squad.name}</h1>
              <p className="mt-1 text-base text-[var(--muted-foreground)]">
                {squad.tagline}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Ver execuções
            </Button>
            <Button variant="primary" size="sm">
              <Sparkles aria-hidden /> Iniciar squad
              <ArrowRight aria-hidden />
            </Button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
            <CardDescription className="text-xs uppercase tracking-wider">
              Tempo médio
            </CardDescription>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--surface-primary)] text-[var(--primary)]">
              <Timer className="h-4 w-4" aria-hidden />
            </span>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-2xl font-semibold">
              {Math.round(squad.avgDurationSeconds / 60)} min
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              {squad.avgDurationSeconds}s por execução
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
            <CardDescription className="text-xs uppercase tracking-wider">
              Custo médio
            </CardDescription>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--surface-accent)] text-[var(--accent)]">
              <Coins className="h-4 w-4" aria-hidden />
            </span>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-2xl font-semibold">
              R$ {squad.avgCostBrl.toFixed(2)}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              {squad.avgTokens.toLocaleString("pt-BR")} tokens
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
            <CardDescription className="text-xs uppercase tracking-wider">
              Agentes
            </CardDescription>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--surface-info)] text-[var(--info)]">
              <Users2 className="h-4 w-4" aria-hidden />
            </span>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-2xl font-semibold">{squad.agents.length}</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              em pipeline sequencial
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
            <CardDescription className="text-xs uppercase tracking-wider">
              Execuções
            </CardDescription>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--surface-success)] text-[var(--success)]">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-2xl font-semibold">
              {squad.runsCompleted}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              concluídas com sucesso
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Como este squad funciona</CardTitle>
          <CardDescription>{squad.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {squad.contextTypes.map((ctx) => (
              <Badge key={ctx} variant="outline">
                Contexto: {ctx === "matter" ? "Caso" : ctx === "document" ? "Documento" : "Lead"}
              </Badge>
            ))}
          </div>

          <Separator />

          <div>
            <p className="mb-3 font-serif text-base font-semibold">
              Pipeline de agentes
            </p>
            <ol className="flex flex-col gap-3">
              {squad.agents.map((agent, idx) => (
                <li
                  key={agent.key}
                  className="flex items-start gap-3 rounded-md border border-[var(--border)] p-3"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-primary)] font-mono text-xs font-semibold text-[var(--primary)]"
                    aria-hidden
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {agent.role}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {agent.capabilities.map((cap) => (
                        <Badge key={cap} variant="default" className="text-[10px]">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
