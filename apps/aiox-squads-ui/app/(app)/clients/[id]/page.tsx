import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Receipt,
  ShieldCheck,
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
import { CLIENTS, getClientById, type ClientConflictStatus } from "@/lib/clients";
import { getMatterById, STATUS_LABEL, BRL } from "@/lib/matters";

const CONFLICT_VARIANT: Record<
  ClientConflictStatus,
  "success" | "warning" | "destructive"
> = {
  limpo: "success",
  verificar: "warning",
  conflito: "destructive",
};

const CONFLICT_LABEL: Record<ClientConflictStatus, string> = {
  limpo: "Sem conflito",
  verificar: "Verificar conflito",
  conflito: "Conflito identificado",
};

export function generateStaticParams() {
  return CLIENTS.map((c) => ({ id: c.id }));
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = getClientById(id);
  if (!client) notFound();

  const matters = client.matterIds
    .map((mid) => getMatterById(mid))
    .filter((m): m is NonNullable<typeof m> => !!m);

  const sections: ContextualSidebarSection[] = [
    {
      key: "overview",
      label: "Visão geral",
      icon: <User className="h-4 w-4" />,
      defaultOpen: true,
      content: (
        <dl className="space-y-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--muted-foreground)]">Tipo</dt>
            <dd>
              <Badge variant={client.kind === "PJ" ? "info" : "default"}>
                {client.kind}
              </Badge>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--muted-foreground)]">Documento</dt>
            <dd className="font-mono text-xs">{client.taxId}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--muted-foreground)]">Cadastrado</dt>
            <dd>{new Date(client.createdAt).toLocaleDateString("pt-BR")}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-[var(--muted-foreground)]">Conflito</dt>
            <dd>
              <Badge variant={CONFLICT_VARIANT[client.conflictStatus]}>
                {CONFLICT_LABEL[client.conflictStatus]}
              </Badge>
            </dd>
          </div>
        </dl>
      ),
    },
    {
      key: "cases",
      label: "Casos",
      icon: <Briefcase className="h-4 w-4" />,
      badge: <span className="text-xs">{matters.length}</span>,
      content:
        matters.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">
            Nenhum caso vinculado.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {matters.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/matters/${m.id}` as Route}
                  className="flex flex-col rounded-md border border-[var(--border)] p-2 hover:bg-[var(--muted)]"
                >
                  <span className="font-mono text-xs font-semibold text-[var(--primary)]">
                    {m.code}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {m.area} · {STATUS_LABEL[m.status]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ),
    },
    {
      key: "documents",
      label: "Documentos",
      icon: <FileText className="h-4 w-4" />,
      content: (
        <p className="text-sm text-[var(--muted-foreground)]">
          {matters.length > 0
            ? `${matters.length * 4} documentos espalhados nos casos.`
            : "Nenhum documento."}
        </p>
      ),
    },
    {
      key: "billing",
      label: "Faturas",
      icon: <Receipt className="h-4 w-4" />,
      content: (
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted-foreground)]">Faturado total</span>
            <span className="font-mono">{BRL.format(client.totalBilledBrl)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted-foreground)]">Em aberto</span>
            <span
              className={`font-mono ${
                client.outstandingBrl > 0
                  ? "text-[var(--destructive)]"
                  : "text-[var(--success)]"
              }`}
            >
              {BRL.format(client.outstandingBrl)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "communications",
      label: "Comunicações",
      icon: <MessageSquare className="h-4 w-4" />,
      content: (
        <p className="text-sm text-[var(--muted-foreground)]">
          Solicitações pendentes: 0 · últimas trocas serão exibidas aqui.
        </p>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={"/clients" as Route}
        className="inline-flex w-fit items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Clientes
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <span
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--surface-primary)] text-lg font-semibold text-[var(--primary)]"
            aria-hidden
          >
            {client.kind === "PJ" ? (
              <Building2 className="h-5 w-5" />
            ) : (
              <User className="h-5 w-5" />
            )}
          </span>
          <div className="min-w-0">
            <h1 className="font-serif text-3xl">{client.name}</h1>
            <p className="mt-1 font-mono text-xs text-[var(--muted-foreground)]">
              {client.taxId}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {client.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
              <Badge variant={CONFLICT_VARIANT[client.conflictStatus]}>
                <ShieldCheck className="h-3 w-3" aria-hidden />
                {CONFLICT_LABEL[client.conflictStatus]}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            Editar
          </Button>
          <Button variant="primary" size="sm">
            Novo caso
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <main className="min-w-0 flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <a
                href={`mailto:${client.email}`}
                className="flex items-center gap-2 rounded-md border border-[var(--border)] p-3 text-sm hover:bg-[var(--muted)]"
              >
                <Mail
                  className="h-4 w-4 text-[var(--muted-foreground)]"
                  aria-hidden
                />
                <span className="truncate">{client.email}</span>
              </a>
              <a
                href={`tel:${client.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 rounded-md border border-[var(--border)] p-3 text-sm hover:bg-[var(--muted)]"
              >
                <Phone
                  className="h-4 w-4 text-[var(--muted-foreground)]"
                  aria-hidden
                />
                <span>{client.phone}</span>
              </a>
              <p className="sm:col-span-2 text-sm text-[var(--muted-foreground)]">
                {client.address}
              </p>
            </CardContent>
          </Card>

          {client.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Anotações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {client.notes}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Casos vinculados</CardTitle>
            </CardHeader>
            <CardContent>
              {matters.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  Sem casos vinculados ainda.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {matters.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/matters/${m.id}` as Route}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[var(--border)] p-4 hover:bg-[var(--muted)]"
                      >
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-semibold text-[var(--primary)]">
                            {m.code}
                          </p>
                          <p className="font-medium">
                            {m.client} <span className="text-[var(--muted-foreground)]">vs.</span>{" "}
                            {m.counterparty}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {m.area} · {STATUS_LABEL[m.status]}
                          </p>
                        </div>
                        <span className="font-mono text-sm">
                          {BRL.format(m.caseValueBrl)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Separator />
        </main>

        <ContextualSidebar sections={sections} />
      </div>
    </div>
  );
}
