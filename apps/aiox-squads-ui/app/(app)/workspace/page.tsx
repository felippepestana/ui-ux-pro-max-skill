import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const KPIS = [
  {
    label: "Casos ativos",
    value: "48",
    delta: "+6 este mês",
    icon: Briefcase,
    tone: "primary" as const,
  },
  {
    label: "HITL pendentes",
    value: "3",
    delta: "Revisão humana",
    icon: CheckCircle2,
    tone: "accent" as const,
  },
  {
    label: "Prazos < 72h",
    value: "5",
    delta: "Atenção crítica",
    icon: Clock,
    tone: "warning" as const,
  },
  {
    label: "Faturamento",
    value: "R$ 184.500",
    delta: "+18% vs. mar",
    icon: Wallet,
    tone: "success" as const,
  },
];

const SQUADS_RUNNING = [
  {
    id: "sq-jurisp-281",
    name: "Pesquisa Jurisprudencial",
    matter: "Caso 2025/482 — Souza vs. Magazine X",
    progress: 72,
    agent: "Agente Citador",
  },
  {
    id: "sq-petic-114",
    name: "Redação de Petição Inicial",
    matter: "Caso 2025/479 — Silva (trabalhista)",
    progress: 41,
    agent: "Agente Redator",
  },
  {
    id: "sq-due-22",
    name: "Due Diligence Contratual",
    matter: "Caso 2025/471 — Aquisição Acme",
    progress: 88,
    agent: "Agente Revisor",
  },
];

const TODAY = [
  { time: "09:30", title: "Audiência — TJSP, 12ª Vara Cível", kind: "Audiência" },
  { time: "11:00", title: "Reunião com cliente — Acme M&A", kind: "Reunião" },
  { time: "15:00", title: "Prazo: réplica processo 2025/465", kind: "Prazo" },
  { time: "17:30", title: "Revisão HITL: minuta de petição #114", kind: "HITL" },
];

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Workspace
          </p>
          <h1 className="mt-1 font-serif text-4xl">
            Bom dia, Dr. Felippe.
          </h1>
          <p className="mt-2 text-base text-[var(--muted-foreground)]">
            Você tem 5 prazos críticos esta semana e 3 entregas aguardando sua
            revisão.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Sparkles aria-hidden /> Iniciar squad
          </Button>
          <Button variant="primary">
            <Plus aria-hidden /> Novo caso
          </Button>
        </div>
      </header>

      <section
        aria-label="Indicadores principais"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          const toneBg = {
            primary: "bg-[var(--surface-primary)] text-[var(--primary)]",
            accent: "bg-[var(--surface-accent)] text-[var(--accent)]",
            warning: "bg-[var(--surface-warning)] text-[var(--warning)]",
            success: "bg-[var(--surface-success)] text-[var(--success)]",
          }[kpi.tone];
          return (
            <Card key={kpi.label}>
              <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
                <CardDescription className="text-xs uppercase tracking-wider">
                  {kpi.label}
                </CardDescription>
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${toneBg}`}
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="font-serif text-3xl font-semibold tracking-tight">
                  {kpi.value}
                </p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {kpi.delta}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hoje</CardTitle>
            <CardDescription>Sua agenda em ordem cronológica</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {TODAY.map((item) => (
              <div
                key={item.time}
                className="flex items-start gap-4 rounded-md border border-[var(--border)] bg-[var(--background)] p-3"
              >
                <div className="font-mono text-sm font-semibold text-[var(--primary)]">
                  {item.time}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {item.kind}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-end justify-between gap-3">
            <div>
              <CardTitle>Squads em execução</CardTitle>
              <CardDescription>
                Pipelines de agentes IA trabalhando agora
              </CardDescription>
            </div>
            <Button variant="link" size="sm">
              Ver todos
              <ArrowUpRight aria-hidden />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {SQUADS_RUNNING.map((squad) => (
              <div
                key={squad.id}
                className="rounded-md border border-[var(--border)] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-serif text-base font-semibold">
                      {squad.name}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {squad.matter}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-primary)] px-2.5 py-1 text-xs font-medium text-[var(--primary)]">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    {squad.agent}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div
                    className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--muted)]"
                    role="progressbar"
                    aria-valuenow={squad.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progresso de ${squad.name}`}
                  >
                    <div
                      className="h-full bg-[var(--primary)] transition-[width] duration-500 ease-out"
                      style={{ width: `${squad.progress}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-semibold text-[var(--muted-foreground)]">
                    {squad.progress}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="accent" size="sm">
              <Sparkles aria-hidden /> Iniciar novo squad
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
