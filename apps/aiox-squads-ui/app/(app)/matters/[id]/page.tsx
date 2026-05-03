import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  CheckCircle2,
  FileText,
  ListChecks,
  ScrollText,
  Receipt,
  Sparkles,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ContextualSidebar,
  type ContextualSidebarSection,
} from "@/components/contextual-sidebar/contextual-sidebar";
import { SquadLauncherButton } from "@/components/squads/squad-launcher-button";
import {
  BRL,
  getMatterById,
  MATTERS,
  PRIORITY_LABEL,
  STATUS_LABEL,
} from "@/lib/matters";
import { ACTIVE_RUNS, getSquadById } from "@/lib/squads";

const PRIORITY_VARIANT = {
  critical: "destructive",
  high: "warning",
  normal: "default",
  low: "outline",
} as const;

const STATUS_VARIANT = {
  intake: "outline",
  triagem: "info",
  ativo: "success",
  aguardando_cliente: "warning",
  audiência: "warning",
  encerrado: "outline",
} as const;

export function generateStaticParams() {
  return MATTERS.map((matter) => ({ id: matter.id }));
}

export default async function MatterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matter = getMatterById(id);
  if (!matter) notFound();

  const activeRun = matter.activeSquadRunId
    ? ACTIVE_RUNS.find((run) => run.id === matter.activeSquadRunId)
    : undefined;
  const activeSquad = activeRun ? getSquadById(activeRun.squadId) : undefined;

  const sections: ContextualSidebarSection[] = [
    {
      key: "summary",
      label: "Resumo",
      icon: <Briefcase className="h-4 w-4" />,
      defaultOpen: true,
      content: <SummarySection matter={matter} />,
    },
    {
      key: "work",
      label: "Trabalho",
      icon: <ListChecks className="h-4 w-4" />,
      defaultOpen: true,
      badge: <span className="text-xs">3 tarefas · 2 prazos</span>,
      content: <WorkSection />,
    },
    {
      key: "documents",
      label: "Documentos",
      icon: <FileText className="h-4 w-4" />,
      badge: <span className="text-xs">7 docs</span>,
      content: <DocumentsSection />,
    },
    {
      key: "squads",
      label: "Squad Runs",
      icon: <Sparkles className="h-4 w-4" />,
      defaultOpen: !!activeRun,
      badge: activeRun ? (
        <span className="text-xs text-[var(--accent)]">1 ativa</span>
      ) : undefined,
      content: (
        <SquadRunsSection
          activeRun={activeRun}
          activeSquadName={activeSquad?.name}
        />
      ),
    },
    {
      key: "billing",
      label: "Financeiro",
      icon: <Receipt className="h-4 w-4" />,
      content: <BillingSection caseValueBrl={matter.caseValueBrl} />,
    },
    {
      key: "audit",
      label: "Auditoria",
      icon: <ScrollText className="h-4 w-4" />,
      content: <AuditSection />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={"/matters" as Route}
        className="inline-flex w-fit items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Casos
      </Link>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs font-semibold text-[var(--primary)]">
              {matter.code}
            </p>
            <h1 className="mt-1 font-serif text-3xl">
              {matter.client} <span className="text-[var(--muted-foreground)]">vs.</span>{" "}
              {matter.counterparty}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{matter.area}</Badge>
              <Badge variant={STATUS_VARIANT[matter.status]}>
                {STATUS_LABEL[matter.status]}
              </Badge>
              <Badge variant={PRIORITY_VARIANT[matter.priority]}>
                Prioridade {PRIORITY_LABEL[matter.priority]}
              </Badge>
              <span className="text-sm text-[var(--muted-foreground)]">
                · Aberto em {new Date(matter.openedAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm">
              <ListChecks aria-hidden /> Nova tarefa
            </Button>
            <SquadLauncherButton
              contextType="matter"
              contextId={matter.id}
              contextLabel={`${matter.code} — ${matter.client}`}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <main className="min-w-0 flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visão geral</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                  Valor da causa
                </p>
                <p className="mt-1 font-serif text-2xl font-semibold">
                  {BRL.format(matter.caseValueBrl)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                  Responsável
                </p>
                <div className="mt-1 inline-flex items-center gap-2">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-primary)] text-sm font-semibold text-[var(--primary)]"
                    aria-hidden
                  >
                    {matter.responsibleInitials}
                  </span>
                  <span className="font-medium">{matter.responsibleName}</span>
                </div>
              </div>
              {matter.nextDeadline && (
                <div className="sm:col-span-2">
                  <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
                    Próximo prazo
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 text-base font-medium">
                    <Clock className="h-4 w-4 text-[var(--destructive)]" aria-hidden />
                    {matter.nextDeadline.label} ·{" "}
                    {new Date(matter.nextDeadline.dueAt).toLocaleDateString("pt-BR")} ·{" "}
                    <strong>em {matter.nextDeadline.hoursLeft}h</strong>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-4">
                <TimelineItem
                  date="28/04"
                  hour="14:32"
                  title="Squad de Pesquisa Jurisprudencial em execução"
                  source="squad"
                  description="Agente Citador localizou 14 decisões do TJSP nos últimos 24 meses."
                />
                <TimelineItem
                  date="26/04"
                  hour="09:10"
                  title="Documento aprovado: Contrato de honorários"
                  source="human"
                  description="Cliente assinou via Zapsign."
                />
                <TimelineItem
                  date="20/04"
                  hour="16:45"
                  title="Caso aberto"
                  source="system"
                  description="Convertido a partir do lead #L-104."
                />
              </ol>
            </CardContent>
          </Card>
        </main>

        <ContextualSidebar sections={sections} />
      </div>
    </div>
  );
}

function TimelineItem({
  date,
  hour,
  title,
  description,
  source,
}: {
  date: string;
  hour: string;
  title: string;
  description: string;
  source: "human" | "squad" | "system";
}) {
  const sourceLabel = {
    human: "Humano",
    squad: "Squad",
    system: "Sistema",
  }[source];
  const sourceVariant = {
    human: "default",
    squad: "accent",
    system: "outline",
  } as const;
  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center text-center">
        <span className="font-mono text-xs font-semibold text-[var(--primary)]">
          {date}
        </span>
        <span className="text-[10px] text-[var(--muted-foreground)]">{hour}</span>
      </div>
      <div className="min-w-0 flex-1 rounded-md border border-[var(--border)] p-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">{title}</p>
          <Badge variant={sourceVariant[source]} className="text-[10px]">
            {sourceLabel}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
    </li>
  );
}

function SummarySection({ matter }: { matter: ReturnType<typeof getMatterById> }) {
  if (!matter) return null;
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <dt className="text-[var(--muted-foreground)]">Cliente</dt>
        <dd className="font-medium">{matter.client}</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-[var(--muted-foreground)]">Parte adversa</dt>
        <dd className="font-medium">{matter.counterparty}</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-[var(--muted-foreground)]">Valor</dt>
        <dd className="font-mono">{BRL.format(matter.caseValueBrl)}</dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-[var(--muted-foreground)]">Aberto</dt>
        <dd>{new Date(matter.openedAt).toLocaleDateString("pt-BR")}</dd>
      </div>
    </dl>
  );
}

function WorkSection() {
  return (
    <ul className="space-y-2 text-sm">
      <li className="flex items-start gap-2">
        <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--success)]" aria-hidden />
        <div className="flex-1">
          <p>Coletar documentos do cliente</p>
          <p className="text-xs text-[var(--muted-foreground)]">Concluída · 26/04</p>
        </div>
      </li>
      <li className="flex items-start gap-2">
        <Clock className="mt-0.5 h-4 w-4 text-[var(--warning)]" aria-hidden />
        <div className="flex-1">
          <p>Redigir minuta de réplica</p>
          <p className="text-xs text-[var(--muted-foreground)]">
            Felippe · vence em 50h
          </p>
        </div>
      </li>
      <li className="flex items-start gap-2">
        <Clock className="mt-0.5 h-4 w-4 text-[var(--destructive)]" aria-hidden />
        <div className="flex-1">
          <p>Protocolar réplica</p>
          <p className="text-xs text-[var(--muted-foreground)]">Crítico · em 50h</p>
        </div>
      </li>
    </ul>
  );
}

function DocumentsSection() {
  const docs = [
    { label: "Petição inicial v3", status: "aprovado" },
    { label: "Procuração assinada", status: "aprovado" },
    { label: "Contrato de honorários", status: "aprovado" },
    { label: "Réplica (rascunho)", status: "rascunho" },
  ];
  return (
    <ul className="space-y-2 text-sm">
      {docs.map((doc) => (
        <li key={doc.label} className="flex items-center justify-between">
          <span className="truncate">{doc.label}</span>
          <Badge
            variant={doc.status === "aprovado" ? "success" : "warning"}
            className="text-[10px]"
          >
            {doc.status}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

function SquadRunsSection({
  activeRun,
  activeSquadName,
}: {
  activeRun: (typeof ACTIVE_RUNS)[number] | undefined;
  activeSquadName?: string;
}) {
  if (!activeRun) {
    return (
      <p className="text-sm text-[var(--muted-foreground)]">
        Nenhuma execução ativa. Use o botão{" "}
        <strong>Disparar Squad</strong> no topo do caso.
      </p>
    );
  }
  return (
    <div className="space-y-3 text-sm">
      <div>
        <p className="font-medium">{activeSquadName}</p>
        <p className="text-xs text-[var(--muted-foreground)]">
          Run #{activeRun.id}
        </p>
      </div>
      <Progress value={activeRun.progress} aria-label="Progresso do squad" />
      <p className="text-xs text-[var(--muted-foreground)]">
        {activeRun.progress}% · {activeRun.totalTokens.toLocaleString("pt-BR")} tokens · R${" "}
        {activeRun.totalCostBrl.toFixed(2)}
      </p>
      <Separator />
      <ul className="space-y-1.5 text-xs">
        {activeRun.steps.map((step) => (
          <li key={step.agentKey} className="flex items-center justify-between">
            <span className="truncate">{step.agentName}</span>
            <Badge
              variant={
                step.status === "done"
                  ? "success"
                  : step.status === "running"
                    ? "info"
                    : step.status === "failed"
                      ? "destructive"
                      : "outline"
              }
              className="text-[10px]"
            >
              {step.status}
            </Badge>
          </li>
        ))}
      </ul>
      <Button asChild variant="outline" size="sm" className="w-full">
        <Link href={`/squads/${activeRun.squadId}` as Route}>
          <Users2 aria-hidden /> Abrir squad
        </Link>
      </Button>
    </div>
  );
}

function BillingSection({ caseValueBrl }: { caseValueBrl: number }) {
  const fees = caseValueBrl * 0.2;
  const billed = fees * 0.4;
  const pct = Math.round((billed / fees) * 100);
  return (
    <div className="space-y-3 text-sm">
      <div>
        <p className="text-xs text-[var(--muted-foreground)]">Honorários estimados</p>
        <p className="font-serif text-lg font-semibold">{BRL.format(fees)}</p>
      </div>
      <Progress value={pct} aria-label="% faturado" />
      <p className="text-xs text-[var(--muted-foreground)]">
        Faturado: {BRL.format(billed)} ({pct}%)
      </p>
    </div>
  );
}

function AuditSection() {
  return (
    <ul className="space-y-2 text-xs text-[var(--muted-foreground)]">
      <li>28/04 14:32 · <strong className="text-[var(--foreground)]">Squad</strong> iniciou Pesquisa Jurispr.</li>
      <li>26/04 09:10 · <strong className="text-[var(--foreground)]">Felippe</strong> aprovou contrato de honorários.</li>
      <li>20/04 16:45 · <strong className="text-[var(--foreground)]">Sistema</strong> abriu o caso a partir do lead #L-104.</li>
    </ul>
  );
}
