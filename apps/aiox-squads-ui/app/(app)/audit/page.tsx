"use client";

import * as React from "react";
import { Bot, Cpu, Download, Search, User } from "lucide-react";
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
  ACTION_LABEL,
  ACTOR_LABEL,
  ACTOR_VARIANT,
  AUDIT_EVENTS,
  ENTITY_LABEL,
  type AuditActorType,
  type AuditEntityType,
  type AuditEvent,
} from "@/lib/audit";

export default function AuditPage() {
  const [search, setSearch] = React.useState("");
  const [actorType, setActorType] = React.useState<AuditActorType | "all">("all");
  const [entityType, setEntityType] = React.useState<AuditEntityType | "all">(
    "all",
  );
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const filtered = React.useMemo<AuditEvent[]>(() => {
    return AUDIT_EVENTS.filter((e) => {
      if (actorType !== "all" && e.actorType !== actorType) return false;
      if (entityType !== "all" && e.entityType !== entityType) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${e.actorName} ${e.entityLabel} ${e.summary}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [actorType, entityType, search]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Negócio · Auditoria
          </p>
          <h1 className="mt-1 font-serif text-4xl">Trilhas de auditoria</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">
            {AUDIT_EVENTS.length} eventos registrados · {filtered.length}{" "}
            visíveis. Toda mutação é logada com origem (humano/squad/sistema)
            e diff antes/depois quando aplicável.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download aria-hidden /> Exportar CSV
        </Button>
      </header>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(220px,1fr)_180px_180px]">
          <label className="relative">
            <span className="sr-only">Buscar eventos</span>
            <Search
              aria-hidden
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <Input
              placeholder="Buscar ator, entidade, descrição…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </label>
          <Select
            value={actorType}
            onValueChange={(v) => setActorType(v as AuditActorType | "all")}
          >
            <SelectTrigger aria-label="Filtrar por origem">
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as origens</SelectItem>
              <SelectItem value="human">Humano</SelectItem>
              <SelectItem value="squad">Squad</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={entityType}
            onValueChange={(v) => setEntityType(v as AuditEntityType | "all")}
          >
            <SelectTrigger aria-label="Filtrar por entidade">
              <SelectValue placeholder="Entidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as entidades</SelectItem>
              {(Object.keys(ENTITY_LABEL) as AuditEntityType[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {ENTITY_LABEL[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--muted)]/50 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Quando</th>
                <th className="px-4 py-3 text-left font-semibold">Origem · Ator</th>
                <th className="px-4 py-3 text-left font-semibold">Ação</th>
                <th className="px-4 py-3 text-left font-semibold">Entidade</th>
                <th className="px-4 py-3 text-left font-semibold">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <p className="font-serif text-lg text-[var(--muted-foreground)]">
                      Nenhum evento nos filtros atuais.
                    </p>
                  </td>
                </tr>
              )}
              {filtered.map((e) => {
                const expanded = expandedId === e.id;
                const ActorIcon =
                  e.actorType === "human"
                    ? User
                    : e.actorType === "squad"
                      ? Bot
                      : Cpu;
                return (
                  <React.Fragment key={e.id}>
                    <tr
                      className="cursor-pointer border-t border-[var(--border)] hover:bg-[var(--muted)]/40"
                      onClick={() => setExpandedId(expanded ? null : e.id)}
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                        {new Date(e.occurredAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-primary)] text-[var(--primary)]">
                            {e.actorInitials ? (
                              <span className="text-[10px] font-semibold">
                                {e.actorInitials}
                              </span>
                            ) : (
                              <ActorIcon className="h-3.5 w-3.5" aria-hidden />
                            )}
                          </span>
                          <div className="min-w-0">
                            <Badge
                              variant={ACTOR_VARIANT[e.actorType]}
                              className="text-[10px]"
                            >
                              {ACTOR_LABEL[e.actorType]}
                            </Badge>
                            <p className="truncate text-xs">{e.actorName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs italic text-[var(--muted-foreground)]">
                        {ACTION_LABEL[e.action]}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-[10px]">
                          {ENTITY_LABEL[e.entityType]}
                        </Badge>
                        <p className="mt-1 truncate text-xs font-mono text-[var(--muted-foreground)]">
                          {e.entityLabel}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs">{e.summary}</td>
                    </tr>
                    {expanded && (
                      <tr className="bg-[var(--muted)]/30">
                        <td colSpan={5} className="px-4 py-3 text-xs">
                          {e.diff && e.diff.length > 0 ? (
                            <div className="space-y-1.5">
                              <p className="font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                                Diff
                              </p>
                              <ul className="space-y-1 font-mono">
                                {e.diff.map((d) => (
                                  <li
                                    key={d.field}
                                    className="rounded-md bg-[var(--background)] p-2"
                                  >
                                    <span className="text-[var(--muted-foreground)]">
                                      {d.field}:
                                    </span>{" "}
                                    <span className="text-[var(--destructive)] line-through">
                                      {d.before}
                                    </span>{" "}
                                    →{" "}
                                    <span className="text-[var(--success)]">
                                      {d.after}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <p className="text-[var(--muted-foreground)]">
                              Sem diff associado a este evento.
                            </p>
                          )}
                          {e.ip && (
                            <p className="mt-2 font-mono text-[10px] text-[var(--muted-foreground)]">
                              IP: {e.ip}
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
