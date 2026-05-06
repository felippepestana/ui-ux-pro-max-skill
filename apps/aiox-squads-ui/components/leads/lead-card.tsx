"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { ArrowRight, ChevronDown, MoreHorizontal, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Lead, SOURCE_LABEL, STAGES, type LeadStage } from "@/lib/leads";

interface LeadCardProps {
  lead: Lead;
  onMove: (leadId: string, stage: LeadStage) => void;
}

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function LeadCard({ lead, onMove }: LeadCardProps) {
  const router = useRouter();

  return (
    <article className="flex flex-col gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] p-3 shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--primary)]/40">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => router.push(`/leads/${lead.id}` as Route)}
          className="min-w-0 flex-1 text-left"
        >
          <p className="truncate font-medium text-[var(--foreground)]">{lead.name}</p>
          <p className="truncate text-xs text-[var(--muted-foreground)]">
            {lead.area}
          </p>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              aria-label="Mais ações"
            >
              <MoreHorizontal className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mover para</DropdownMenuLabel>
            {STAGES.filter((s) => s.key !== lead.stage).map((s) => (
              <DropdownMenuItem
                key={s.key}
                onSelect={() => onMove(lead.id, s.key)}
              >
                {s.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => router.push(`/leads/${lead.id}` as Route)}
            >
              Abrir lead
              <ArrowRight className="ml-auto h-3.5 w-3.5" aria-hidden />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="line-clamp-2 text-xs text-[var(--muted-foreground)]">
        {lead.summary}
      </p>

      <div className="mt-1 flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs font-semibold text-[var(--primary)]">
          {BRL.format(lead.estimatedValueBrl)}
        </span>
        <Badge variant="outline" className="text-[10px]">
          {SOURCE_LABEL[lead.source]}
        </Badge>
        {lead.triagedBySquad && (
          <Badge variant="accent" className="text-[10px]">
            <Sparkles className="h-3 w-3" aria-hidden />
            triado
          </Badge>
        )}
      </div>
    </article>
  );
}

export function LeadStageBadge({ stage }: { stage: LeadStage }) {
  const meta = STAGES.find((s) => s.key === stage);
  if (!meta) return null;
  return (
    <Badge variant="outline" className="text-[10px]">
      <ChevronDown className="h-3 w-3" aria-hidden />
      {meta.label}
    </Badge>
  );
}
