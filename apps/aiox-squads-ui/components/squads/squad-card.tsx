"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { ArrowRight, Coins, Sparkles, Timer, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MATTERS } from "@/lib/matters";
import { getSquadIcon } from "@/lib/squad-icons";
import type { Squad } from "@/lib/squads";

interface SquadCardProps {
  squad: Squad;
}

const CONTEXT_LABEL: Record<Squad["contextTypes"][number], string> = {
  matter: "Caso",
  document: "Documento",
  lead: "Lead",
};

export function SquadCard({ squad }: SquadCardProps) {
  const router = useRouter();
  const Icon = getSquadIcon(squad.iconKey);
  const [open, setOpen] = React.useState(false);
  const [contextType, setContextType] = React.useState<
    Squad["contextTypes"][number]
  >(squad.contextTypes[0] ?? "matter");
  const [contextId, setContextId] = React.useState<string>("");

  const matterOptions = MATTERS.filter(
    (m) => m.status !== "encerrado",
  );

  const canStart = !!contextId || contextType === "lead";

  function handleStart() {
    setOpen(false);
    router.push(`/squads/${squad.id}/run` as Route);
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="gap-3">
        <div className="flex items-start gap-3">
          <span
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--surface-primary)] text-[var(--primary)]"
            aria-hidden
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-lg font-semibold leading-tight">
              {squad.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {squad.tagline}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {squad.contextTypes.map((ctx) => (
            <Badge key={ctx} variant="outline" className="text-[10px]">
              {CONTEXT_LABEL[ctx]}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="text-sm text-[var(--muted-foreground)] line-clamp-3">
          {squad.description}
        </p>

        <div className="grid grid-cols-3 gap-3 rounded-md border border-[var(--border)] bg-[var(--background)] p-3">
          <Stat
            icon={<Timer className="h-3.5 w-3.5" aria-hidden />}
            label="Tempo"
            value={`${Math.round(squad.avgDurationSeconds / 60)} min`}
          />
          <Stat
            icon={<Coins className="h-3.5 w-3.5" aria-hidden />}
            label="Custo"
            value={`R$ ${squad.avgCostBrl.toFixed(2)}`}
          />
          <Stat
            icon={<Users2 className="h-3.5 w-3.5" aria-hidden />}
            label="Agentes"
            value={String(squad.agents.length)}
          />
        </div>

        <p className="text-xs text-[var(--muted-foreground)]">
          {squad.runsCompleted.toLocaleString("pt-BR")} execuções concluídas
        </p>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/squads/${squad.id}` as Route)}
        >
          Detalhes
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="primary" size="sm" className="ml-auto">
              <Sparkles aria-hidden /> Iniciar
              <ArrowRight aria-hidden />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col gap-6">
            <SheetHeader>
              <SheetTitle>Iniciar “{squad.name}”</SheetTitle>
              <SheetDescription>
                Selecione o contexto que será passado aos agentes. O resultado
                final irá para o Inbox HITL para sua aprovação.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                  Tipo de contexto
                </span>
                <Select
                  value={contextType}
                  onValueChange={(v) =>
                    setContextType(v as Squad["contextTypes"][number])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {squad.contextTypes.map((ctx) => (
                      <SelectItem key={ctx} value={ctx}>
                        {CONTEXT_LABEL[ctx]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              {contextType === "matter" && (
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                    Caso
                  </span>
                  <Select value={contextId} onValueChange={setContextId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um caso" />
                    </SelectTrigger>
                    <SelectContent>
                      {matterOptions.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.code} — {m.client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
              )}

              {contextType === "document" && (
                <p className="rounded-md border border-[var(--border)] bg-[var(--muted)] p-3 text-xs text-[var(--muted-foreground)]">
                  Mock — seleção de documento será habilitada na Fase 5.
                </p>
              )}

              {contextType === "lead" && (
                <p className="rounded-md border border-[var(--border)] bg-[var(--muted)] p-3 text-xs text-[var(--muted-foreground)]">
                  Mock — seleção de lead será habilitada na Fase 3.
                </p>
              )}
            </div>

            <SheetFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleStart}
                disabled={!canStart}
              >
                <Sparkles aria-hidden /> Disparar squad
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
        {icon}
        {label}
      </span>
      <p className="mt-0.5 font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}
