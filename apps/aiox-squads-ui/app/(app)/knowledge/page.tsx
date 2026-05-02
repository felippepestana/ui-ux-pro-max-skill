"use client";

import * as React from "react";
import {
  BookMarked,
  ExternalLink,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  getKnowledgeAreas,
  getKnowledgeTopicsForArea,
  KIND_LABEL,
  KIND_VARIANT,
  KNOWLEDGE,
  type KnowledgeArea,
  type KnowledgeEntry,
  type KnowledgeKind,
} from "@/lib/knowledge";

const ALL_AREAS = getKnowledgeAreas();

export default function KnowledgePage() {
  const [search, setSearch] = React.useState("");
  const [area, setArea] = React.useState<KnowledgeArea | null>(null);
  const [topic, setTopic] = React.useState<string | null>(null);
  const [kindFilter, setKindFilter] = React.useState<KnowledgeKind | "all">(
    "all",
  );
  const [selected, setSelected] = React.useState<KnowledgeEntry | null>(
    KNOWLEDGE[0] ?? null,
  );

  const filtered = React.useMemo<KnowledgeEntry[]>(() => {
    return KNOWLEDGE.filter((k) => {
      if (area && k.area !== area) return false;
      if (topic && k.topic !== topic) return false;
      if (kindFilter !== "all" && k.kind !== kindFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${k.title} ${k.excerpt} ${k.tags.join(" ")} ${k.source}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [area, topic, kindFilter, search]);

  const KIND_OPTIONS: { key: KnowledgeKind | "all"; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "jurisprudencia", label: "Jurisprudência" },
    { key: "sumula", label: "Súmula" },
    { key: "modelo", label: "Modelo" },
    { key: "doutrina", label: "Doutrina" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Conhecimento jurídico
          </p>
          <h1 className="mt-1 font-serif text-4xl">Knowledge Base</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">
            Jurisprudência, súmulas, modelos e doutrina. {KNOWLEDGE.length}{" "}
            entradas indexadas. Busca semântica chega em v1.5 — por ora a
            busca é literal.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Sparkles aria-hidden /> Disparar pesquisa
          </Button>
          <Button variant="primary" size="sm">
            <Plus aria-hidden /> Adicionar entrada
          </Button>
        </div>
      </header>

      <Card>
        <CardContent className="grid gap-3 p-4">
          <label className="relative">
            <span className="sr-only">Buscar conhecimento</span>
            <Search
              aria-hidden
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <Input
              placeholder="Buscar por título, ementa, tag, fonte…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </label>
          <div className="flex flex-wrap gap-1.5">
            {KIND_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setKindFilter(opt.key)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  kindFilter === opt.key
                    ? "border-[var(--primary)] bg-[var(--surface-primary)] text-[var(--primary)]"
                    : "border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_360px]">
        <aside
          aria-label="Árvore de áreas"
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3"
        >
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
            Áreas do direito
          </p>
          <ul className="flex flex-col gap-0.5">
            <li>
              <button
                type="button"
                onClick={() => {
                  setArea(null);
                  setTopic(null);
                }}
                aria-pressed={area === null}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                  area === null
                    ? "bg-[var(--surface-primary)] text-[var(--primary)] font-medium"
                    : "hover:bg-[var(--muted)]"
                }`}
              >
                <span>Todas</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {KNOWLEDGE.length}
                </span>
              </button>
            </li>
            {ALL_AREAS.map((a) => {
              const count = KNOWLEDGE.filter((k) => k.area === a).length;
              const isActive = area === a;
              return (
                <li key={a}>
                  <button
                    type="button"
                    onClick={() => {
                      setArea(a);
                      setTopic(null);
                    }}
                    aria-pressed={isActive}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-[var(--surface-primary)] text-[var(--primary)] font-medium"
                        : "hover:bg-[var(--muted)]"
                    }`}
                  >
                    <span>{a}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {count}
                    </span>
                  </button>
                  {isActive && (
                    <ul className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-[var(--border)] pl-2">
                      {getKnowledgeTopicsForArea(a).map((t) => (
                        <li key={t.topic}>
                          <button
                            type="button"
                            onClick={() => setTopic(t.topic)}
                            aria-pressed={topic === t.topic}
                            className={`flex w-full items-center justify-between rounded-sm px-2 py-1 text-xs transition-colors ${
                              topic === t.topic
                                ? "bg-[var(--muted)] text-[var(--foreground)] font-medium"
                                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]/60"
                            }`}
                          >
                            <span>{t.topic}</span>
                            <span>{t.count}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>

        <section
          aria-label="Resultados"
          className="flex flex-col gap-2"
        >
          <p className="px-1 text-xs text-[var(--muted-foreground)]">
            {filtered.length} resultado(s)
            {area && ` em ${area}`}
            {topic && ` · ${topic}`}
          </p>
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="font-serif text-lg text-[var(--muted-foreground)]">
                  Nenhum resultado para esta combinação.
                </p>
              </CardContent>
            </Card>
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((k) => (
                <li key={k.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(k)}
                    className={`block w-full rounded-md border p-3 text-left transition-colors ${
                      selected?.id === k.id
                        ? "border-[var(--primary)] bg-[var(--surface-primary)]"
                        : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]/40"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={KIND_VARIANT[k.kind]}
                        className="text-[10px]"
                      >
                        {KIND_LABEL[k.kind]}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {k.area}
                      </Badge>
                      <span className="ml-auto text-[10px] text-[var(--muted-foreground)]">
                        {k.citations} citações
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{k.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted-foreground)]">
                      {k.excerpt}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside
          aria-label="Pré-visualização"
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
        >
          {selected ? (
            <article className="flex flex-col gap-3">
              <header className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={KIND_VARIANT[selected.kind]}>
                    {KIND_LABEL[selected.kind]}
                  </Badge>
                  <Badge variant="outline">{selected.area}</Badge>
                </div>
                <h3 className="font-serif text-lg font-semibold leading-tight">
                  {selected.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {selected.source}
                  {selected.rapporteur && ` · ${selected.rapporteur}`}
                  {selected.date &&
                    ` · ${new Date(selected.date).toLocaleDateString("pt-BR")}`}
                </p>
              </header>

              <Separator />

              <p className="text-sm leading-relaxed">{selected.excerpt}</p>

              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px]">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm">
                  <BookMarked aria-hidden /> Adicionar a um caso
                </Button>
                {selected.url && (
                  <Button variant="outline" size="sm">
                    <ExternalLink aria-hidden /> Fonte
                  </Button>
                )}
              </div>
            </article>
          ) : (
            <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">
              Selecione uma entrada para visualizar.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
