import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Inbox,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type HitlPriority = "critical" | "high" | "normal";

type HitlTask = {
  id: string;
  matter: string;
  squad: string;
  agent: string;
  excerpt: string;
  priority: HitlPriority;
  dueIn: string;
  assignedTo: string;
  citationsCount: number;
  costTokens: number;
};

const TASKS: HitlTask[] = [
  {
    id: "hitl-281",
    matter: "Caso 2025/482 — Souza vs. Magazine X",
    squad: "Pesquisa Jurisprudencial",
    agent: "Agente Citador",
    excerpt:
      "Localizadas 14 decisões do TJSP nos últimos 24 meses sobre danos morais por cobrança vexatória. A tese mais sustentada (REsp 2.014.391/SP) reforça a aplicação do CDC art. 42, parágrafo único…",
    priority: "critical",
    dueIn: "em 8h",
    assignedTo: "Felippe Pestana",
    citationsCount: 14,
    costTokens: 38_420,
  },
  {
    id: "hitl-114",
    matter: "Caso 2025/479 — Silva (trabalhista)",
    squad: "Redação de Petição Inicial",
    agent: "Agente Redator",
    excerpt:
      "Minuta de petição inicial concluída. Pedidos: reconhecimento de vínculo empregatício, verbas rescisórias, danos morais (R$ 15.000) e honorários sucumbenciais. Revisão humana necessária antes do protocolo no PJe…",
    priority: "high",
    dueIn: "em 1d",
    assignedTo: "Felippe Pestana",
    citationsCount: 6,
    costTokens: 22_180,
  },
  {
    id: "hitl-22",
    matter: "Caso 2025/471 — Aquisição Acme",
    squad: "Due Diligence Contratual",
    agent: "Agente Revisor",
    excerpt:
      "Análise concluída em 47 cláusulas do MSA. Identificadas 3 cláusulas com risco alto (limitação de responsabilidade, indenização e MAC clause) e 8 com sugestão de revisão. Diff completo anexo…",
    priority: "normal",
    dueIn: "em 3d",
    assignedTo: "Equipe Acme",
    citationsCount: 3,
    costTokens: 64_900,
  },
];

const PRIORITY_BADGE: Record<HitlPriority, { variant: "destructive" | "warning" | "default"; label: string }> = {
  critical: { variant: "destructive", label: "Prazo crítico" },
  high: { variant: "warning", label: "Prioridade alta" },
  normal: { variant: "default", label: "Normal" },
};

export const metadata = { title: "Inbox HITL" };

export default function InboxPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Inbox HITL
          </p>
          <h1 className="mt-1 font-serif text-4xl">Aprovações pendentes</h1>
          <p className="mt-2 max-w-3xl text-base text-[var(--muted-foreground)]">
            Cada output dos squads passa por revisão humana antes de ser
            entregue. Aprove ou devolva com anotações.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Minhas tarefas
          </Button>
          <Button variant="ghost" size="sm">
            Toda a equipe
          </Button>
          <Button variant="ghost" size="sm">
            Resolvidas
          </Button>
        </div>
      </header>

      <section
        aria-label="Resumo do inbox"
        className="grid gap-4 md:grid-cols-3"
      >
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
            <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
              Pendentes
            </p>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--surface-primary)] text-[var(--primary)]">
              <Inbox className="h-4 w-4" aria-hidden />
            </span>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-3xl font-semibold">3</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Aguardando você
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
            <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
              Críticas
            </p>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--surface-destructive)] text-[var(--destructive)]">
              <AlertCircle className="h-4 w-4" aria-hidden />
            </span>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-3xl font-semibold">1</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Prazo &lt; 24h
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
            <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
              Aprovadas hoje
            </p>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[var(--surface-success)] text-[var(--success)]">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
            </span>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-3xl font-semibold">5</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Tempo médio: 4 min
            </p>
          </CardContent>
        </Card>
      </section>

      <ul className="flex flex-col gap-4">
        {TASKS.map((task) => {
          const priority = PRIORITY_BADGE[task.priority];
          return (
            <li key={task.id}>
              <Card>
                <CardHeader className="gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                      <CardTitle>{task.matter}</CardTitle>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Squad: <span className="font-medium text-[var(--foreground)]">{task.squad}</span>
                        {" · "}
                        Agente: <span className="font-medium text-[var(--foreground)]">{task.agent}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={priority.variant}>{priority.label}</Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3" aria-hidden />
                        {task.dueIn}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  <p className="rounded-md border border-[var(--border)] bg-[var(--background)] p-4 text-sm leading-relaxed text-[var(--foreground)]">
                    {task.excerpt}
                  </p>

                  <Separator />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted-foreground)]">
                      <span className="inline-flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                        {task.citationsCount} citação(ões) jurisprudencial(is)
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden />
                        {task.costTokens.toLocaleString("pt-BR")} tokens
                      </span>
                      <span>Atribuído a {task.assignedTo}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="ghost" size="sm">
                        Devolver com anotações
                      </Button>
                      <Button variant="primary" size="sm">
                        <CheckCircle2 aria-hidden />
                        Aprovar e entregar
                      </Button>
                    </div>
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
