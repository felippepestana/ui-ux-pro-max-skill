"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeadlineCalendar } from "@/components/deadlines/deadline-calendar";
import {
  DEADLINES,
  hoursUntil,
  isCritical,
  KIND_LABEL,
  STATUS_LABEL,
  todayAnchor,
  type Deadline,
  type DeadlineStatus,
} from "@/lib/deadlines";

const STATUS_VARIANT: Record<
  DeadlineStatus,
  "success" | "info" | "warning" | "destructive" | "outline"
> = {
  agendado: "info",
  em_andamento: "warning",
  cumprido: "success",
  perdido: "destructive",
};

export default function DeadlinesPage() {
  const anchor = React.useMemo(() => todayAnchor(), []);
  const [selected, setSelected] = React.useState<Date | null>(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    DeadlineStatus | "all"
  >("all");
  const [criticalOnly, setCriticalOnly] = React.useState(false);

  const filtered = React.useMemo<Deadline[]>(() => {
    return DEADLINES.filter((d) => {
      if (criticalOnly && !isCritical(d)) return false;
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (selected) {
        const dueDate = new Date(d.dueAt).toDateString();
        if (dueDate !== selected.toDateString()) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const haystack =
          `${d.title} ${d.matterCode} ${d.matterClient} ${d.court} ${d.responsibleName}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort(
      (a, b) =>
        new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
    );
  }, [search, statusFilter, criticalOnly, selected]);

  const stats = {
    total: DEADLINES.length,
    critical: DEADLINES.filter(isCritical).length,
    upcoming: DEADLINES.filter((d) => {
      const h = hoursUntil(d.dueAt);
      return d.status === "agendado" && h > 72 && h <= 24 * 30;
    }).length,
    fulfilled: DEADLINES.filter((d) => d.status === "cumprido").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Trabalho jurídico · Prazos
          </p>
          <h1 className="mt-1 font-serif text-4xl">Prazos</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">
            {stats.total} prazos · <strong>{stats.critical}</strong> críticos
            (&lt; 72h) · {stats.upcoming} no próximo mês ·{" "}
            <strong>{stats.fulfilled}</strong> cumpridos.
            <span className="ml-1 italic">
              Regra forense BR completa chega na v1.5 (Squad Cálculo de Prazo).
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Importar do PJe
          </Button>
          <Button variant="primary" size="sm">
            <Plus aria-hidden /> Novo prazo
          </Button>
        </div>
      </header>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(220px,1fr)_180px_auto]">
          <label className="relative">
            <span className="sr-only">Buscar prazos</span>
            <Search
              aria-hidden
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <Input
              placeholder="Buscar por título, caso, tribunal, responsável…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </label>
          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as DeadlineStatus | "all")
            }
          >
            <SelectTrigger aria-label="Filtrar por status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {(Object.keys(STATUS_LABEL) as DeadlineStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={criticalOnly ? "primary" : "outline"}
            onClick={() => setCriticalOnly((p) => !p)}
            aria-pressed={criticalOnly}
          >
            <Filter aria-hidden /> &lt; 72h apenas
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <DeadlineCalendar
          deadlines={DEADLINES}
          anchor={anchor}
          selected={selected}
          onSelect={setSelected}
        />

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle>
              {selected
                ? `Prazos em ${selected.toLocaleDateString("pt-BR")}`
                : criticalOnly
                  ? "Críticos"
                  : "Próximos prazos"}
            </CardTitle>
            <Badge variant="outline">{filtered.length}</Badge>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                Nenhum prazo nos filtros atuais.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {filtered.map((d) => (
                  <DeadlineRow key={d.id} deadline={d} />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DeadlineRow({ deadline }: { deadline: Deadline }) {
  const h = hoursUntil(deadline.dueAt);
  const overdue = h < 0 && deadline.status !== "cumprido";
  const critical = !overdue && isCritical(deadline);
  const fulfilled = deadline.status === "cumprido";

  return (
    <li>
      <Link
        href={`/matters/${deadline.matterId}` as Route}
        className="block rounded-md border border-[var(--border)] p-4 transition-colors hover:bg-[var(--muted)]/50"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                {KIND_LABEL[deadline.kind]}
              </Badge>
              <Badge variant={STATUS_VARIANT[deadline.status]}>
                {STATUS_LABEL[deadline.status]}
              </Badge>
              {fulfilled && deadline.evidenceUrl && (
                <Badge variant="success" className="text-[10px]">
                  <CheckCircle2 className="h-3 w-3" aria-hidden /> evidência
                </Badge>
              )}
              {(overdue || critical) && (
                <Badge variant={overdue ? "destructive" : "warning"}>
                  <AlertCircle className="h-3 w-3" aria-hidden />
                  {overdue
                    ? `atrasado ${Math.abs(h)}h`
                    : `em ${h}h`}
                </Badge>
              )}
            </div>
            <p className="mt-2 font-medium">{deadline.title}</p>
            <p className="mt-1 font-mono text-xs text-[var(--primary)]">
              {deadline.matterCode} · {deadline.matterClient}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {deadline.court} ·{" "}
              {new Date(deadline.dueAt).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {deadline.forensicRule && ` · ${deadline.forensicRule}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-primary)] text-[10px] font-semibold text-[var(--primary)]"
              aria-label={deadline.responsibleName}
              title={deadline.responsibleName}
            >
              {deadline.responsibleInitials}
            </span>
            <Clock
              className={
                overdue
                  ? "h-4 w-4 text-[var(--destructive)]"
                  : critical
                    ? "h-4 w-4 text-[var(--warning)]"
                    : "h-4 w-4 text-[var(--muted-foreground)]"
              }
              aria-hidden
            />
          </div>
        </div>
      </Link>
    </li>
  );
}
