"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * KanbanBoard — generic, drag-free board for v1.
 *
 * Items are bucketed by `getStage(item)`. Each card renders via `renderCard`.
 * Stage transitions in v1 happen via menus inside the card (see /leads page),
 * not via drag-and-drop — this keeps the component dependency-light and
 * accessibility-first. Real DnD with `@dnd-kit` is planned for v1.5.
 */

interface Stage<TStageKey extends string> {
  key: TStageKey;
  label: string;
  description?: string;
}

interface KanbanBoardProps<TItem, TStageKey extends string> {
  items: TItem[];
  stages: ReadonlyArray<Stage<TStageKey>>;
  getStage: (item: TItem) => TStageKey;
  getItemKey: (item: TItem) => string;
  renderCard: (item: TItem) => React.ReactNode;
  renderColumnFooter?: (stage: Stage<TStageKey>, items: TItem[]) => React.ReactNode;
  className?: string;
}

export function KanbanBoard<TItem, TStageKey extends string>({
  items,
  stages,
  getStage,
  getItemKey,
  renderCard,
  renderColumnFooter,
  className,
}: KanbanBoardProps<TItem, TStageKey>) {
  const grouped = React.useMemo(() => {
    const map = new Map<TStageKey, TItem[]>();
    for (const stage of stages) map.set(stage.key, []);
    for (const item of items) {
      const stage = getStage(item);
      const bucket = map.get(stage);
      if (bucket) bucket.push(item);
    }
    return map;
  }, [items, stages, getStage]);

  return (
    <div
      role="list"
      aria-label="Pipeline Kanban"
      className={cn(
        "flex gap-4 overflow-x-auto pb-4",
        "scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent",
        className,
      )}
    >
      {stages.map((stage) => {
        const stageItems = grouped.get(stage.key) ?? [];
        return (
          <section
            key={stage.key}
            role="listitem"
            aria-label={`Coluna ${stage.label}`}
            className="flex w-72 shrink-0 flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 p-3"
          >
            <header className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]">
                  {stage.label}
                </h3>
                {stage.description && (
                  <p className="text-[10px] text-[var(--muted-foreground)]">
                    {stage.description}
                  </p>
                )}
              </div>
              <span className="rounded-full bg-[var(--card)] px-2 py-0.5 text-xs font-semibold text-[var(--muted-foreground)]">
                {stageItems.length}
              </span>
            </header>

            <ul className="flex flex-col gap-2">
              {stageItems.length === 0 && (
                <li className="rounded-md border border-dashed border-[var(--border)] p-4 text-center text-xs text-[var(--muted-foreground)]">
                  Nenhum item
                </li>
              )}
              {stageItems.map((item) => (
                <li key={getItemKey(item)}>{renderCard(item)}</li>
              ))}
            </ul>

            {renderColumnFooter && renderColumnFooter(stage, stageItems)}
          </section>
        );
      })}
    </div>
  );
}
