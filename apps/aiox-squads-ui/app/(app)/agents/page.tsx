import Link from "next/link";
import type { Route } from "next";
import { Bot, Coins, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSquadIcon } from "@/lib/squad-icons";
import { SQUADS, type Agent } from "@/lib/squads";

type AgentRow = Agent & {
  squadId: string;
  squadName: string;
  squadKey: string;
  iconKey: (typeof SQUADS)[number]["iconKey"];
};

const AGENTS: AgentRow[] = SQUADS.flatMap((squad) =>
  squad.agents.map((agent) => ({
    ...agent,
    squadId: squad.id,
    squadName: squad.name,
    squadKey: squad.key,
    iconKey: squad.iconKey,
  })),
);

const TOTAL_RUNS = SQUADS.reduce((sum, s) => sum + s.runsCompleted, 0);

export const metadata = { title: "Agentes" };

export default function AgentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Automação · Agentes
          </p>
          <h1 className="mt-1 font-serif text-4xl">Agentes IA</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">
            {AGENTS.length} agentes especializados distribuídos em{" "}
            {SQUADS.length} squads. {TOTAL_RUNS.toLocaleString("pt-BR")}{" "}
            execuções no acumulado do escritório.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={"/squads" as Route}>
            <Sparkles aria-hidden /> Ver squads
          </Link>
        </Button>
      </header>

      <Card>
        <CardContent className="p-4">
          <label className="relative">
            <span className="sr-only">Buscar agentes</span>
            <Search
              aria-hidden
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <Input
              placeholder="Buscar por nome do agente, capabilidade…"
              className="pl-9"
              disabled
              aria-disabled
              title="Filtros avançados em F2.x"
            />
          </label>
        </CardContent>
      </Card>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {AGENTS.map((agent) => {
          const Icon = getSquadIcon(agent.iconKey);
          return (
            <li key={`${agent.squadId}-${agent.key}`}>
              <Card className="flex h-full flex-col">
                <CardHeader className="flex-row items-start justify-between gap-3 pb-2">
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--surface-primary)] text-[var(--primary)]"
                      aria-hidden
                    >
                      <Bot className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <CardTitle className="text-base leading-tight">
                        {agent.name}
                      </CardTitle>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {agent.role}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-3">
                  <Link
                    href={`/squads/${agent.squadId}` as Route}
                    className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--surface-accent)] px-2 py-1 text-[10px] font-medium text-[var(--accent)] hover:opacity-90"
                  >
                    <Icon className="h-3 w-3" aria-hidden />
                    {agent.squadName}
                  </Link>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                      Capabilities
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {agent.capabilities.map((cap) => (
                        <Badge
                          key={cap}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center gap-2 pt-2 text-[10px] text-[var(--muted-foreground)]">
                    <Coins className="h-3 w-3" aria-hidden />
                    Custo configurado pelo squad
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
