"use client";

import * as React from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight, Building2, Plus, Search, User } from "lucide-react";
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
import { CLIENTS, type Client, type ClientKind, type ClientConflictStatus } from "@/lib/clients";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const CONFLICT_VARIANT: Record<
  ClientConflictStatus,
  "success" | "warning" | "destructive"
> = {
  limpo: "success",
  verificar: "warning",
  conflito: "destructive",
};

const CONFLICT_LABEL: Record<ClientConflictStatus, string> = {
  limpo: "Limpo",
  verificar: "Verificar",
  conflito: "Conflito",
};

export default function ClientsPage() {
  const [search, setSearch] = React.useState("");
  const [kind, setKind] = React.useState<ClientKind | "all">("all");
  const [conflictStatus, setConflictStatus] = React.useState<
    ClientConflictStatus | "all"
  >("all");

  const filtered = React.useMemo<Client[]>(() => {
    return CLIENTS.filter((c) => {
      if (kind !== "all" && c.kind !== kind) return false;
      if (conflictStatus !== "all" && c.conflictStatus !== conflictStatus)
        return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack =
          `${c.name} ${c.taxId} ${c.email} ${c.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [kind, conflictStatus, search]);

  const totalOutstanding = filtered.reduce((sum, c) => sum + c.outstandingBrl, 0);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Trabalho jurídico · Clientes
          </p>
          <h1 className="mt-1 font-serif text-4xl">Clientes</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {CLIENTS.length} cadastrados · {filtered.length} visíveis ·{" "}
            <strong>{BRL.format(totalOutstanding)}</strong> em aberto
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Importar contatos
          </Button>
          <Button variant="primary" size="sm">
            <Plus aria-hidden /> Novo cliente
          </Button>
        </div>
      </header>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(220px,1fr)_180px_180px]">
          <label className="relative">
            <span className="sr-only">Buscar clientes</span>
            <Search
              aria-hidden
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <Input
              placeholder="Buscar por nome, CPF/CNPJ, e-mail, tag…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </label>
          <Select value={kind} onValueChange={(v) => setKind(v as ClientKind | "all")}>
            <SelectTrigger aria-label="Filtrar por tipo">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="PF">Pessoa Física</SelectItem>
              <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={conflictStatus}
            onValueChange={(v) =>
              setConflictStatus(v as ClientConflictStatus | "all")
            }
          >
            <SelectTrigger aria-label="Filtrar por conflito">
              <SelectValue placeholder="Conflito" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="limpo">Limpo</SelectItem>
              <SelectItem value="verificar">Verificar</SelectItem>
              <SelectItem value="conflito">Conflito</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead className="border-b border-[var(--border)] bg-[var(--muted)]/50 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Cliente</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Tipo</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Documento</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Tags</th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">Conflito</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Faturado</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Em aberto</th>
                <th scope="col" className="px-4 py-3 text-center font-semibold">Casos</th>
                <th scope="col" className="px-4 py-3 sr-only">Abrir</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <p className="font-serif text-lg text-[var(--muted-foreground)]">
                      Nenhum cliente encontrado.
                    </p>
                  </td>
                </tr>
              )}
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-[var(--border)] transition-colors hover:bg-[var(--muted)]/40"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.name}</p>
                    <p className="truncate text-xs text-[var(--muted-foreground)]">
                      {c.email}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={c.kind === "PJ" ? "info" : "default"}>
                      {c.kind === "PJ" ? (
                        <Building2 className="h-3 w-3" aria-hidden />
                      ) : (
                        <User className="h-3 w-3" aria-hidden />
                      )}
                      {c.kind}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{c.taxId}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                      {c.tags.length > 3 && (
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                          +{c.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={CONFLICT_VARIANT[c.conflictStatus]}>
                      {CONFLICT_LABEL[c.conflictStatus]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs">
                    {BRL.format(c.totalBilledBrl)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs">
                    {c.outstandingBrl > 0 ? (
                      <span className="text-[var(--destructive)]">
                        {BRL.format(c.outstandingBrl)}
                      </span>
                    ) : (
                      <span className="text-[var(--muted-foreground)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-xs">
                    {c.matterIds.length}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/clients/${c.id}` as Route}>
                        Abrir
                        <ArrowUpRight aria-hidden />
                      </Link>
                    </Button>
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
