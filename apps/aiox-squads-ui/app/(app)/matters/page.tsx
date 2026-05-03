"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight, Clock, Filter, Plus, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AREAS,
  BRL,
  MATTERS,
  PRIORITY_LABEL,
  STATUS_LABEL,
  type Matter,
  type MatterArea,
  type MatterPriority,
  type MatterStatus,
} from "@/lib/matters";

const PRIORITY_VARIANT: Record<
  MatterPriority,
  "destructive" | "warning" | "default" | "outline"
> = {
  critical: "destructive",
  high: "warning",
  normal: "default",
  low: "outline",
};

const STATUS_VARIANT: Record<
  MatterStatus,
  "default" | "info" | "success" | "warning" | "outline"
> = {
  intake: "outline",
  triagem: "info",
  ativo: "success",
  aguardando_cliente: "warning",
  audiência: "warning",
  encerrado: "outline",
};

export default function MattersPage() {
  const [search, setSearch] = React.useState("");
  const [area, setArea] = React.useState<MatterArea | "all">("all");
  const [status, setStatus] = React.useState<MatterStatus | "all">("all");
  const [criticalOnly, setCriticalOnly] = React.useState(false);

  const filtered = React.useMemo<Matter[]>(() => {
    return MATTERS.filter((matter) => {
      if (criticalOnly && !(matter.nextDeadline && matter.nextDeadline.hoursLeft <= 72)) {
        return false;
      }
      if (area !== "all" && matter.area !== area) return false;
      if (status !== "all" && matter.status !== status) return false;
      if (search) {
        const haystack =
          `${matter.code} ${matter.client} ${matter.counterparty} ${matter.responsibleName}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [area, status, criticalOnly, search]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Trabalho jurídico
          </p>
          <h1 className="mt-1 font-serif text-4xl">Casos</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {MATTERS.length} casos no escritório · {filtered.length} visíveis
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Importar do PJe
          </Button>
          <Button variant="primary" size="sm">
            <Plus aria-hidden /> Novo caso
          </Button>
        </div>
      </header>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_180px_200px_auto]">
            <label className="relative">
              <span className="sr-only">Buscar casos</span>
              <Search
                aria-hidden
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
              />
              <Input
                placeholder="Buscar por nº, cliente, parte, responsável…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </label>
            <Select value={area} onValueChange={(v) => setArea(v as MatterArea | "all")}>
              <SelectTrigger aria-label="Filtrar por área">
                <SelectValue placeholder="Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as áreas</SelectItem>
                {AREAS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as MatterStatus | "all")}
            >
              <SelectTrigger aria-label="Filtrar por status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {(Object.keys(STATUS_LABEL) as MatterStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={criticalOnly ? "primary" : "outline"}
              size="md"
              onClick={() => setCriticalOnly((prev) => !prev)}
              aria-pressed={criticalOnly}
            >
              <Filter aria-hidden />
              Prazo &lt; 72h
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead className="border-b border-[var(--border)] bg-[var(--muted)]/50 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Nº</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Cliente · Parte</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Área</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Prioridade</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Valor</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Próximo prazo</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Resp.</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold sr-only">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <p className="font-serif text-lg text-[var(--muted-foreground)]">
                      Nenhum caso encontrado com os filtros atuais.
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      Ajuste os filtros ou crie um novo caso.
                    </p>
                  </td>
                </tr>
              )}
              {filtered.map((matter) => (
                <tr
                  key={matter.id}
                  className="border-t border-[var(--border)] transition-colors hover:bg-[var(--muted)]/40"
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-[var(--primary)]">
                    {matter.code}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{matter.client}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      vs. {matter.counterparty}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{matter.area}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[matter.status]}>
                      {STATUS_LABEL[matter.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={PRIORITY_VARIANT[matter.priority]}>
                      {PRIORITY_LABEL[matter.priority]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    {BRL.format(matter.caseValueBrl)}
                  </td>
                  <td className="px-4 py-3">
                    {matter.nextDeadline ? (
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <Clock
                          aria-hidden
                          className={
                            matter.nextDeadline.hoursLeft <= 72
                              ? "h-3.5 w-3.5 text-[var(--destructive)]"
                              : "h-3.5 w-3.5 text-[var(--muted-foreground)]"
                          }
                        />
                        {matter.nextDeadline.label} ·{" "}
                        <strong>{matter.nextDeadline.hoursLeft}h</strong>
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--muted-foreground)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 text-xs">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-primary)] text-[10px] font-semibold text-[var(--primary)]"
                        aria-hidden
                      >
                        {matter.responsibleInitials}
                      </span>
                      <span className="hidden xl:inline">{matter.responsibleName}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {matter.activeSquadRunId && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-accent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent)]"
                          title="Squad em execução"
                        >
                          <Sparkles className="h-3 w-3" aria-hidden />
                          run
                        </span>
                      )}
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/matters/${matter.id}` as Route}>
                          Abrir
                          <ArrowUpRight aria-hidden />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
