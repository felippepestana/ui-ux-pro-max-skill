import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ContextualSidebar,
  type ContextualSidebarSection,
} from "@/components/contextual-sidebar/contextual-sidebar";
import { SquadLauncherButton } from "@/components/squads/squad-launcher-button";
import { getLeadById, LEADS, SOURCE_LABEL, STAGES } from "@/lib/leads";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function generateStaticParams() {
  return LEADS.map((lead) => ({ id: lead.id }));
}

const STAGE_VARIANT = {
  novo: "info",
  qualificado: "default",
  proposta: "warning",
  aceite: "success",
  perdido: "outline",
} as const;

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = getLeadById(id);
  if (!lead) notFound();

  const stage = STAGES.find((s) => s.key === lead.stage);
  const canConvert = lead.stage === "aceite";

  const sections: ContextualSidebarSection[] = [
    {
      key: "data",
      label: "Dados",
      icon: <User className="h-4 w-4" />,
      defaultOpen: true,
      content: (
        <dl className="space-y-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--muted-foreground)]">Origem</dt>
            <dd>
              <Badge variant="outline" className="text-[10px]">
                {SOURCE_LABEL[lead.source]}
              </Badge>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--muted-foreground)]">Área</dt>
            <dd className="font-medium">{lead.area}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--muted-foreground)]">Valor</dt>
            <dd className="font-mono">{BRL.format(lead.estimatedValueBrl)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--muted-foreground)]">Recebido</dt>
            <dd>{new Date(lead.createdAt).toLocaleDateString("pt-BR")}</dd>
          </div>
        </dl>
      ),
    },
    {
      key: "activities",
      label: "Atividades",
      icon: <Clock className="h-4 w-4" />,
      content: (
        <ul className="space-y-2 text-xs text-[var(--muted-foreground)]">
          <li>27/04 14:32 · Triagem automática concluída</li>
          <li>27/04 09:10 · Primeiro contato via formulário do site</li>
          <li>26/04 — sem retorno ainda</li>
        </ul>
      ),
    },
    {
      key: "proposal",
      label: "Proposta",
      icon: <ArrowRight className="h-4 w-4" />,
      content: (
        <div className="space-y-3 text-sm">
          {lead.stage === "novo" || lead.stage === "qualificado" ? (
            <p className="text-[var(--muted-foreground)]">
              Proposta ainda não enviada.
            </p>
          ) : (
            <>
              <p>Honorários estimados em {BRL.format(lead.estimatedValueBrl * 0.2)}.</p>
              <Button variant="outline" size="sm" className="w-full">
                Reenviar proposta
              </Button>
            </>
          )}
        </div>
      ),
    },
    {
      key: "conversion",
      label: "Conversão",
      icon: <CheckCircle2 className="h-4 w-4" />,
      content: (
        <div className="space-y-3 text-sm">
          {canConvert ? (
            <>
              <p className="text-[var(--success)]">
                Lead aceito — pronto para conversão em cliente + caso.
              </p>
              <Button variant="primary" size="sm" className="w-full">
                <CheckCircle2 aria-hidden /> Converter em cliente
              </Button>
            </>
          ) : (
            <p className="text-[var(--muted-foreground)]">
              Conversão disponível apenas após o lead atingir o estágio
              {" "}&ldquo;Aceite&rdquo;.
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={"/leads" as Route}
        className="inline-flex w-fit items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Leads
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-semibold text-[var(--primary)]">
            #{lead.id}
          </p>
          <h1 className="mt-1 font-serif text-3xl">{lead.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{lead.area}</Badge>
            {stage && (
              <Badge variant={STAGE_VARIANT[lead.stage]}>{stage.label}</Badge>
            )}
            {lead.triagedBySquad && (
              <Badge variant="accent">
                <Sparkles className="h-3 w-3" aria-hidden />
                triado · {Math.round(lead.triagedBySquad.confidence * 100)}%
                confiança
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            Editar
          </Button>
          <SquadLauncherButton
            contextType="lead"
            contextId={lead.id}
            contextLabel={lead.name}
          />
        </div>
      </header>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <main className="min-w-0 flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do caso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{lead.summary}</p>

              <Separator />

              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={`mailto:${lead.contactEmail}`}
                  className="flex items-center gap-2 rounded-md border border-[var(--border)] p-3 text-sm hover:bg-[var(--muted)]"
                >
                  <Mail
                    className="h-4 w-4 text-[var(--muted-foreground)]"
                    aria-hidden
                  />
                  <span className="truncate">{lead.contactEmail}</span>
                </a>
                <a
                  href={`tel:${lead.contactPhone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 rounded-md border border-[var(--border)] p-3 text-sm hover:bg-[var(--muted)]"
                >
                  <Phone
                    className="h-4 w-4 text-[var(--muted-foreground)]"
                    aria-hidden
                  />
                  <span>{lead.contactPhone}</span>
                </a>
              </div>
            </CardContent>
          </Card>

          {lead.triagedBySquad && (
            <Card>
              <CardHeader>
                <CardTitle>Recomendação do Squad de Triagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    variant={
                      lead.triagedBySquad.recommendation === "aceitar"
                        ? "success"
                        : lead.triagedBySquad.recommendation === "revisar"
                          ? "warning"
                          : "destructive"
                    }
                  >
                    {lead.triagedBySquad.recommendation.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    confiança {Math.round(lead.triagedBySquad.confidence * 100)}%
                  </span>
                  <span className="font-mono text-xs text-[var(--muted-foreground)]">
                    Run #{lead.triagedBySquad.runId}
                  </span>
                </div>
                <ul className="space-y-1 text-sm text-[var(--muted-foreground)]">
                  <li>
                    <strong className="text-[var(--foreground)]">Área:</strong>{" "}
                    {lead.area}
                  </li>
                  <li>
                    <strong className="text-[var(--foreground)]">Valor estimado:</strong>{" "}
                    {BRL.format(lead.estimatedValueBrl)}
                  </li>
                  <li>
                    <strong className="text-[var(--foreground)]">Conflito:</strong>{" "}
                    Sem conflito de interesse identificado.
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}

          {lead.lostReason && (
            <Card>
              <CardHeader>
                <CardTitle>Motivo da perda</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {lead.lostReason}
                </p>
              </CardContent>
            </Card>
          )}
        </main>

        <ContextualSidebar sections={sections} />
      </div>
    </div>
  );
}
