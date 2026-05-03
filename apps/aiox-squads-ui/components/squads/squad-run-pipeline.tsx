"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Agent, Squad } from "@/lib/squads";

/**
 * SquadRunPipeline — execução simulada de um Squad com SSE-like streaming.
 *
 * Cada agente avança automaticamente em sequência (queued → running → done),
 * com tokens/custo crescendo proporcionalmente. Ao concluir todos os steps,
 * o estado vai para `needs_review` e o usuário pode "Enviar para Inbox HITL".
 *
 * Fase 6 substituirá esta simulação local por um stream SSE real vindo do
 * backend (provavelmente via Inngest + Supabase Realtime).
 */

type StepRuntime = {
  agent: Agent;
  status: "queued" | "running" | "done";
  tokens: number;
  costBrl: number;
  output: string | null;
  startedAt: number | null;
  finishedAt: number | null;
};

type RunStatus = "queued" | "running" | "needs_review" | "approved";

interface SquadRunPipelineProps {
  squad: Squad;
}

export function SquadRunPipeline({ squad }: SquadRunPipelineProps) {
  const router = useRouter();
  const [status, setStatus] = React.useState<RunStatus>("queued");
  const [steps, setSteps] = React.useState<StepRuntime[]>(() =>
    squad.agents.map((agent) => ({
      agent,
      status: "queued",
      tokens: 0,
      costBrl: 0,
      output: null,
      startedAt: null,
      finishedAt: null,
    })),
  );
  const [activeIdx, setActiveIdx] = React.useState<number>(-1);

  const totalTokens = steps.reduce((sum, s) => sum + s.tokens, 0);
  const totalCost = steps.reduce((sum, s) => sum + s.costBrl, 0);
  const progress = Math.round(
    (steps.filter((s) => s.status === "done").length / steps.length) * 100,
  );

  React.useEffect(() => {
    if (status !== "queued" && status !== "running") return;
    if (activeIdx === -1) return;

    const step = steps[activeIdx];
    if (!step || step.status !== "running") return;

    const targetTokens = Math.round(
      squad.avgTokens / squad.agents.length + Math.random() * 1500,
    );
    const targetCost = Number(
      (squad.avgCostBrl / squad.agents.length).toFixed(2),
    );
    const startedAt = Date.now();

    let tickCount = 0;
    const totalTicks = 12;
    const interval = setInterval(() => {
      tickCount += 1;
      const ratio = Math.min(tickCount / totalTicks, 1);

      setSteps((prev) =>
        prev.map((s, idx) =>
          idx === activeIdx
            ? {
                ...s,
                tokens: Math.round(targetTokens * ratio),
                costBrl: Number((targetCost * ratio).toFixed(2)),
              }
            : s,
        ),
      );

      if (tickCount >= totalTicks) {
        clearInterval(interval);
        const finishedAt = Date.now();
        setSteps((prev) =>
          prev.map((s, idx) =>
            idx === activeIdx
              ? {
                  ...s,
                  status: "done",
                  tokens: targetTokens,
                  costBrl: targetCost,
                  output: mockOutputForAgent(squad, s.agent),
                  startedAt,
                  finishedAt,
                }
              : s,
          ),
        );

        const next = activeIdx + 1;
        if (next < squad.agents.length) {
          setActiveIdx(next);
          setSteps((prev) =>
            prev.map((s, idx) =>
              idx === next ? { ...s, status: "running", startedAt: Date.now() } : s,
            ),
          );
        } else {
          setStatus("needs_review");
          toast.success("Squad concluído", {
            description: "Resultado pronto para revisão humana (HITL).",
          });
        }
      }
    }, 350);

    return () => clearInterval(interval);
  }, [activeIdx, status, squad, steps]);

  function startRun() {
    if (status !== "queued") return;
    setStatus("running");
    setActiveIdx(0);
    setSteps((prev) =>
      prev.map((s, idx) =>
        idx === 0 ? { ...s, status: "running", startedAt: Date.now() } : s,
      ),
    );
    toast("Squad iniciado", {
      description: `${squad.name} em execução…`,
    });
  }

  function approveAndSend() {
    setStatus("approved");
    toast.success("Enviado para Inbox HITL", {
      description: "Aguardando aprovação final do responsável.",
    });
    setTimeout(() => router.push("/inbox"), 600);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <section aria-label="Pipeline de agentes">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3">
            <CardTitle>Pipeline</CardTitle>
            <Badge variant={statusBadgeVariant(status)}>{statusLabel(status)}</Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {steps.map((step, idx) => (
              <PipelineStep key={step.agent.key} step={step} index={idx} />
            ))}

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Progresso</span>
              <span className="font-mono">{progress}%</span>
            </div>
            <Progress value={progress} aria-label="Progresso geral" />

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Stat label="Tokens" value={totalTokens.toLocaleString("pt-BR")} />
              <Stat label="Custo" value={`R$ ${totalCost.toFixed(2)}`} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-label="Saída dos agentes" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-xl">Saída ao vivo</h2>
          <div className="flex items-center gap-2">
            {status === "queued" && (
              <Button variant="primary" onClick={startRun}>
                <Sparkles aria-hidden /> Iniciar execução
              </Button>
            )}
            {status === "running" && (
              <Button variant="outline" disabled>
                <Loader2 className="animate-spin" aria-hidden /> Em execução…
              </Button>
            )}
            {status === "needs_review" && (
              <>
                <Button variant="outline">
                  <X aria-hidden /> Cancelar
                </Button>
                <Button variant="primary" onClick={approveAndSend}>
                  <CheckCircle2 aria-hidden /> Enviar para Inbox HITL
                  <ArrowRight aria-hidden />
                </Button>
              </>
            )}
            {status === "approved" && (
              <Badge variant="success" className="text-sm">
                Enviado para revisão
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {steps.map((step) => (
            <AgentOutput key={step.agent.key} step={step} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PipelineStep({ step, index }: { step: StepRuntime; index: number }) {
  const tone =
    step.status === "done"
      ? "success"
      : step.status === "running"
        ? "info"
        : "outline";
  return (
    <div
      className="flex items-start gap-3 rounded-md border border-[var(--border)] p-3"
      data-status={step.status}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-primary)] font-mono text-xs font-semibold text-[var(--primary)]"
        aria-hidden
      >
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium">{step.agent.name}</p>
          <Badge variant={tone} className="text-[10px]">
            {step.status === "running" ? (
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
            ) : step.status === "done" ? (
              <CheckCircle2 className="h-3 w-3" aria-hidden />
            ) : (
              <CircleDashed className="h-3 w-3" aria-hidden />
            )}
            {step.status === "queued"
              ? "Aguardando"
              : step.status === "running"
                ? "Executando"
                : "Concluído"}
          </Badge>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">
          {step.agent.role}
        </p>
        {step.tokens > 0 && (
          <p className="mt-1 font-mono text-[10px] text-[var(--muted-foreground)]">
            {step.tokens.toLocaleString("pt-BR")} tokens · R${" "}
            {step.costBrl.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}

function AgentOutput({ step }: { step: StepRuntime }) {
  if (step.status === "queued") {
    return (
      <Card className="opacity-60">
        <CardContent className="p-4">
          <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
            {step.agent.name}
          </p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Aguardando agente anterior concluir…
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
            {step.agent.name}
          </p>
          {step.status === "running" && (
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--info)]">
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
              pensando…
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-[var(--foreground)]">
          {step.output ?? <em className="text-[var(--muted-foreground)]">Processando…</em>}
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--border)] p-2">
      <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}

function statusLabel(status: RunStatus) {
  return {
    queued: "Aguardando",
    running: "Em execução",
    needs_review: "Pronto para HITL",
    approved: "Enviado",
  }[status];
}

function statusBadgeVariant(
  status: RunStatus,
): "outline" | "info" | "warning" | "success" {
  return {
    queued: "outline" as const,
    running: "info" as const,
    needs_review: "warning" as const,
    approved: "success" as const,
  }[status];
}

function mockOutputForAgent(squad: Squad, agent: Agent): string {
  const map: Record<string, Record<string, string>> = {
    "pesquisa-jurisprudencial": {
      "extrator-tese":
        "Controvérsia identificada: cobrança vexatória após quitação. Tese aplicável: CDC art. 42, parágrafo único — direito à repetição em dobro do indébito.",
      buscador:
        "14 decisões localizadas no TJSP nos últimos 24 meses. Bases consultadas: STJ, STF, TJSP. Score médio de aderência: 0.78.",
      rankeador:
        "Top 3 decisões ranqueadas: REsp 2.014.391/SP (0.92), REsp 1.785.004/SP (0.87), AC 1043287-22.2022.8.26.0100/TJSP (0.83).",
      citador:
        "Citações formatadas em ABNT prontas para colagem. Cada citação inclui ementa, link para o tribunal e relator.",
    },
    "redacao-peticao-inicial": {
      estruturador:
        "Estrutura processual definida: rito comum (CPC art. 318). Seções: qualificação, fatos, fundamentos, pedidos, valor da causa.",
      redator:
        "Minuta de petição inicial gerada (8 páginas). Pedidos: declaração de inexigibilidade do débito, repetição em dobro, danos morais (R$ 15.000), honorários sucumbenciais.",
      revisor:
        "Revisão concluída. 0 erros ortográficos, 2 sugestões de formalidade aplicadas, formatação ABNT validada.",
    },
    "triagem-lead": {
      classificador:
        "Área identificada: Direito do Consumidor. Tipo: pleito por restituição de cobrança indevida. Confiança: 91%.",
      "avaliador-conflito":
        "Sem conflito de interesse. Cruzamento de CPF não retornou matches na base de clientes ativos.",
      "estimador-valor":
        "Valor estimado da causa: R$ 25.000–35.000 (dano material) + R$ 10.000–20.000 (dano moral). Honorários estimados: R$ 7.000.",
    },
  };
  return (
    map[squad.key]?.[agent.key] ??
    `Saída simulada do agente ${agent.name} (${agent.role}).`
  );
}
