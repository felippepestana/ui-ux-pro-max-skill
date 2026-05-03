"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowUpRight,
  FileEdit,
  FileText,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DOCUMENTS,
  KIND_LABEL,
  STATUS_LABEL,
  STATUS_VARIANT,
  TEMPLATES,
  type DocumentItem,
  type DocumentTemplate,
} from "@/lib/documents";

export default function DocumentsPage() {
  const [search, setSearch] = React.useState("");

  const filteredDocs = React.useMemo<DocumentItem[]>(() => {
    if (!search) return DOCUMENTS;
    const q = search.toLowerCase();
    return DOCUMENTS.filter((d) =>
      `${d.title} ${d.matterCode} ${d.matterClient}`
        .toLowerCase()
        .includes(q),
    );
  }, [search]);

  const filteredTpls = React.useMemo<DocumentTemplate[]>(() => {
    if (!search) return TEMPLATES;
    const q = search.toLowerCase();
    return TEMPLATES.filter((t) =>
      `${t.title} ${t.area} ${t.description}`.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Trabalho jurídico · Documentos
          </p>
          <h1 className="mt-1 font-serif text-4xl">Documentos</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Biblioteca de modelos e documentos do escritório vinculados aos casos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Sparkles aria-hidden /> Squad de Redação
          </Button>
          <Button variant="primary" size="sm">
            <Plus aria-hidden /> Novo documento
          </Button>
        </div>
      </header>

      <Card>
        <CardContent className="grid gap-3 p-4">
          <label className="relative">
            <span className="sr-only">Buscar documentos e modelos</span>
            <Search
              aria-hidden
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <Input
              placeholder="Buscar título, área, cliente, caso…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </label>
        </CardContent>
      </Card>

      <Tabs defaultValue="documents" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="documents">
            <FileText className="h-3.5 w-3.5" aria-hidden /> Documentos do escritório (
            {filteredDocs.length})
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileEdit className="h-3.5 w-3.5" aria-hidden /> Modelos (
            {filteredTpls.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-0">
          {filteredDocs.length === 0 ? (
            <EmptyCard message="Nenhum documento encontrado." />
          ) : (
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredDocs.map((doc) => (
                <li key={doc.id}>
                  <DocumentTile doc={doc} />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="templates" className="mt-0">
          {filteredTpls.length === 0 ? (
            <EmptyCard message="Nenhum modelo encontrado." />
          ) : (
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredTpls.map((tpl) => (
                <li key={tpl.id}>
                  <TemplateTile tpl={tpl} />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DocumentTile({ doc }: { doc: DocumentItem }) {
  const sourceFromSquad = doc.versions[0]?.sourceRunId;
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--surface-primary)] text-[var(--primary)]"
            aria-hidden
          >
            <FileText className="h-4 w-4" />
          </span>
          <Badge variant={STATUS_VARIANT[doc.status]}>
            {STATUS_LABEL[doc.status]}
          </Badge>
        </div>
        <h3 className="font-serif text-base font-semibold leading-tight">
          {doc.title}
        </h3>
        <p className="font-mono text-xs text-[var(--primary)]">
          {doc.matterCode} · {doc.matterClient}
        </p>
        <p className="text-xs text-[var(--muted-foreground)]">
          {KIND_LABEL[doc.kind]} · v{doc.currentVersion} · atualizado{" "}
          {new Date(doc.updatedAt).toLocaleDateString("pt-BR")}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-[10px] text-[var(--muted-foreground)]">
            {doc.approvalsObtained}/{doc.approvalsRequired} aprovações
            {sourceFromSquad && (
              <Badge variant="accent" className="ml-2 text-[10px]">
                <Sparkles className="h-3 w-3" aria-hidden /> squad
              </Badge>
            )}
          </span>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/documents/${doc.id}` as Route}>
              Abrir
              <ArrowUpRight aria-hidden />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TemplateTile({ tpl }: { tpl: DocumentTemplate }) {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--surface-accent)] text-[var(--accent)]"
            aria-hidden
          >
            <FileEdit className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-base font-semibold leading-tight">
              {tpl.title}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              {tpl.area} · usado {tpl.usageCount}x
            </p>
          </div>
        </div>
        <p className="text-sm text-[var(--muted-foreground)] line-clamp-3">
          {tpl.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tpl.variables.slice(0, 3).map((v) => (
            <Badge key={v} variant="outline" className="text-[10px]">
              {`{{ ${v} }}`}
            </Badge>
          ))}
          {tpl.variables.length > 3 && (
            <span className="text-[10px] text-[var(--muted-foreground)]">
              +{tpl.variables.length - 3} variáveis
            </span>
          )}
        </div>
        <div className="mt-auto pt-2">
          <Button variant="primary" size="sm" className="w-full">
            <Sparkles aria-hidden /> Gerar com Squad
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyCard({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <p className="font-serif text-lg text-[var(--muted-foreground)]">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}
