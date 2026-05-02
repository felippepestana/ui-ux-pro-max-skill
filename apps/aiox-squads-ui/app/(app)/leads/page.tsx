"use client";

import * as React from "react";
import { Plus, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { LeadCard } from "@/components/leads/lead-card";
import { LEADS, STAGES, type Lead, type LeadStage } from "@/lib/leads";

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export default function LeadsPage() {
  const [items, setItems] = React.useState<Lead[]>(LEADS);
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((lead) => {
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.area.toLowerCase().includes(q) ||
        lead.summary.toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  function moveLead(id: string, stage: LeadStage) {
    setItems((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, stage } : lead)),
    );
    const lead = items.find((l) => l.id === id);
    const stageMeta = STAGES.find((s) => s.key === stage);
    if (lead && stageMeta) {
      toast(`${lead.name}`, {
        description: `Movido para "${stageMeta.label}"`,
      });
    }
  }

  const totalPipeline = items
    .filter((l) => l.stage !== "perdido")
    .reduce((sum, l) => sum + l.estimatedValueBrl, 0);

  const conversionRate = (() => {
    const total = items.length;
    if (total === 0) return 0;
    const won = items.filter((l) => l.stage === "aceite").length;
    return Math.round((won / total) * 100);
  })();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Trabalho jurídico · CRM
          </p>
          <h1 className="mt-1 font-serif text-4xl">Leads</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {items.length} oportunidades · {filtered.length} visíveis ·{" "}
            <strong>{BRL.format(totalPipeline)}</strong> em pipeline ·{" "}
            {conversionRate}% taxa de aceite
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Importar CSV
          </Button>
          <Button variant="primary" size="sm">
            <Plus aria-hidden /> Novo lead
          </Button>
        </div>
      </header>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(220px,1fr)_auto]">
          <label className="relative">
            <span className="sr-only">Buscar leads</span>
            <Search
              aria-hidden
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <Input
              placeholder="Buscar por nome, área, resumo…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </label>
          <Button
            variant="outline"
            size="md"
            onClick={() =>
              toast("Disparando Triagem em todos os leads novos…", {
                description:
                  "Squad de Triagem qualifica área, urgência e conflito automaticamente.",
                icon: <Sparkles className="h-4 w-4" />,
              })
            }
          >
            <Sparkles aria-hidden /> Triar leads novos
          </Button>
        </CardContent>
      </Card>

      <KanbanBoard<Lead, LeadStage>
        items={filtered}
        stages={STAGES}
        getStage={(lead) => lead.stage}
        getItemKey={(lead) => lead.id}
        renderCard={(lead) => <LeadCard lead={lead} onMove={moveLead} />}
        renderColumnFooter={(stage, stageItems) => {
          const total = stageItems.reduce(
            (sum, l) => sum + l.estimatedValueBrl,
            0,
          );
          if (total === 0) return null;
          return (
            <p className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
              Total: <strong>{BRL.format(total)}</strong>
            </p>
          );
        }}
      />
    </div>
  );
}
