import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  History,
  ListChecks,
  PenTool,
  Send,
  ShieldCheck,
  Sparkles,
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
import {
  DOCUMENTS,
  getDocumentById,
  KIND_LABEL,
  STATUS_LABEL,
  STATUS_VARIANT,
} from "@/lib/documents";

export function generateStaticParams() {
  return DOCUMENTS.map((d) => ({ id: d.id }));
}

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doc = getDocumentById(id);
  if (!doc) notFound();

  const currentV = doc.versions.find((v) => v.version === doc.currentVersion);

  const sections: ContextualSidebarSection[] = [
    {
      key: "versions",
      label: "Versões",
      icon: <History className="h-4 w-4" />,
      defaultOpen: true,
      badge: <span className="text-xs">v{doc.currentVersion}</span>,
      content: (
        <ul className="flex flex-col gap-2 text-sm">
          {[...doc.versions].reverse().map((v) => (
            <li
              key={v.id}
              className={`rounded-md border p-2 ${
                v.version === doc.currentVersion
                  ? "border-[var(--primary)] bg-[var(--surface-primary)]"
                  : "border-[var(--border)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold">
                  v{v.version}
                </span>
                {v.sourceRunId && (
                  <Badge variant="accent" className="text-[10px]">
                    <Sparkles className="h-3 w-3" aria-hidden /> squad
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-xs">{v.authorName}</p>
              <p className="text-[10px] text-[var(--muted-foreground)]">
                {new Date(v.createdAt).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {v.diffSummary && (
                <p className="mt-1 font-mono text-[10px]">
                  <span className="text-[var(--success)]">
                    +{v.diffSummary.added}
                  </span>{" "}
                  <span className="text-[var(--destructive)]">
                    -{v.diffSummary.removed}
                  </span>
                </p>
              )}
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "approvals",
      label: "Aprovações",
      icon: <ShieldCheck className="h-4 w-4" />,
      defaultOpen: true,
      content: (
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted-foreground)]">Status</span>
            <Badge variant={STATUS_VARIANT[doc.status]}>
              {STATUS_LABEL[doc.status]}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted-foreground)]">Aprovações</span>
            <span className="font-mono text-xs">
              {doc.approvalsObtained}/{doc.approvalsRequired}
            </span>
          </div>
          {doc.signers.length > 0 && (
            <div>
              <p className="text-[var(--muted-foreground)]">Assinantes</p>
              <ul className="mt-1 space-y-1 text-xs">
                {doc.signers.map((s) => (
                  <li
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[var(--surface-success)] px-2 py-1 text-[var(--success)]"
                  >
                    <CheckCircle2 className="h-3 w-3" aria-hidden /> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "tasks",
      label: "Tarefas",
      icon: <ListChecks className="h-4 w-4" />,
      content: (
        <p className="text-sm text-[var(--muted-foreground)]">
          Vinculação com tarefas chega na sincronização cruzada da F4.
        </p>
      ),
    },
    {
      key: "audit",
      label: "Auditoria",
      icon: <FileText className="h-4 w-4" />,
      content: (
        <ul className="space-y-1.5 text-xs text-[var(--muted-foreground)]">
          <li>
            {new Date(doc.updatedAt).toLocaleDateString("pt-BR")} ·{" "}
            <strong className="text-[var(--foreground)]">
              {currentV?.authorName ?? "Sistema"}
            </strong>{" "}
            atualizou para v{doc.currentVersion}.
          </li>
          {doc.versions[0]?.sourceRunId && (
            <li>
              {new Date(doc.versions[0].createdAt).toLocaleDateString("pt-BR")}{" "}
              ·{" "}
              <strong className="text-[var(--foreground)]">Squad</strong>{" "}
              gerou v1 (run #{doc.versions[0].sourceRunId}).
            </li>
          )}
        </ul>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={"/documents" as Route}
        className="inline-flex w-fit items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Documentos
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-semibold text-[var(--primary)]">
            {doc.matterCode} · {doc.matterClient}
          </p>
          <h1 className="mt-1 font-serif text-3xl">{doc.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{KIND_LABEL[doc.kind]}</Badge>
            <Badge variant={STATUS_VARIANT[doc.status]}>
              {STATUS_LABEL[doc.status]}
            </Badge>
            <Badge variant="default">v{doc.currentVersion}</Badge>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Download aria-hidden /> Exportar DOCX
          </Button>
          <Button variant="outline" size="sm">
            <Send aria-hidden /> Solicitar aprovação
          </Button>
          <SquadLauncherButton
            contextType="document"
            contextId={doc.id}
            contextLabel={doc.title}
          />
        </div>
      </header>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <main className="min-w-0 flex-1 space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2">
              <CardTitle>Pré-visualização (v{doc.currentVersion})</CardTitle>
              <Button variant="ghost" size="sm">
                <PenTool aria-hidden /> Editar
              </Button>
            </CardHeader>
            <CardContent>
              <article className="prose-aiox space-y-4 rounded-md border border-[var(--border)] bg-[var(--background)] p-6 font-serif text-sm leading-relaxed">
                <p className="text-center font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Mock — visualização do documento
                </p>
                <Separator />
                <p>{currentV?.excerpt}</p>
                <p className="italic text-[var(--muted-foreground)]">
                  […conteúdo completo carregado em F5/F6 quando integrado ao
                  storage…]
                </p>
              </article>
            </CardContent>
          </Card>

          {doc.status === "em_revisao" && (
            <Card className="border-[var(--warning)]/40 bg-[var(--surface-warning)]">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">Revisão humana pendente</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {doc.approvalsObtained}/{doc.approvalsRequired} aprovações
                    obtidas. Necessário aprovar antes do protocolo.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Devolver
                  </Button>
                  <Button variant="primary" size="sm">
                    <CheckCircle2 aria-hidden /> Aprovar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>

        <ContextualSidebar sections={sections} />
      </div>
    </div>
  );
}
