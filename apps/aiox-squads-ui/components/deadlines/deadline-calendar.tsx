"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Deadline, isCritical } from "@/lib/deadlines";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/**
 * Light-weight monthly calendar that highlights days with deadlines and
 * lets the user click a day to filter the side list. No external date
 * library — we operate on JS Date directly. Forensic-rule logic (BR
 * holidays + per-court rules) lives in Phase F9.
 */
interface DeadlineCalendarProps {
  deadlines: Deadline[];
  anchor: Date;
  selected: Date | null;
  onSelect: (date: Date | null) => void;
}

export function DeadlineCalendar({
  deadlines,
  anchor,
  selected,
  onSelect,
}: DeadlineCalendarProps) {
  const [view, setView] = React.useState<Date>(() => firstOfMonth(anchor));

  const days = React.useMemo(() => buildMonthMatrix(view), [view]);

  const dotsByKey = React.useMemo(() => {
    const map = new Map<string, Deadline[]>();
    for (const d of deadlines) {
      const key = dayKey(new Date(d.dueAt));
      const bucket = map.get(key) ?? [];
      bucket.push(d);
      map.set(key, bucket);
    }
    return map;
  }, [deadlines]);

  function shiftMonth(delta: number) {
    setView((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + delta);
      return next;
    });
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <header className="mb-3 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => shiftMonth(-1)}
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Button>
        <p className="font-serif text-base font-semibold">
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => shiftMonth(1)}
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </header>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {WEEKDAYS.map((wd, i) => (
          <span key={`${wd}-${i}`} aria-hidden>
            {wd}
          </span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const inMonth = day.getMonth() === view.getMonth();
          const isToday = sameDay(day, anchor);
          const isSelected = selected ? sameDay(day, selected) : false;
          const dayDeadlines = dotsByKey.get(dayKey(day)) ?? [];
          const hasCritical = dayDeadlines.some(isCritical);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() =>
                onSelect(isSelected ? null : day)
              }
              aria-pressed={isSelected}
              aria-label={`${day.getDate()} de ${MONTHS[day.getMonth()]} · ${dayDeadlines.length} prazo(s)`}
              className={cn(
                "relative flex h-12 flex-col items-center justify-center rounded-md text-sm transition-colors",
                "hover:bg-[var(--muted)]",
                !inMonth && "text-[var(--muted-foreground)] opacity-50",
                inMonth && !isSelected && "text-[var(--foreground)]",
                isToday && !isSelected && "ring-1 ring-[var(--primary)]",
                isSelected &&
                  "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--navy-800)]",
              )}
            >
              <span className="font-medium">{day.getDate()}</span>
              {dayDeadlines.length > 0 && (
                <span className="mt-0.5 flex items-center gap-0.5">
                  {dayDeadlines.slice(0, 3).map((d, idx) => (
                    <span
                      key={d.id + idx}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        hasCritical && d.status !== "cumprido"
                          ? "bg-[var(--destructive)]"
                          : isSelected
                            ? "bg-white/80"
                            : "bg-[var(--accent)]",
                      )}
                      aria-hidden
                    />
                  ))}
                  {dayDeadlines.length > 3 && (
                    <span
                      className="text-[8px] font-mono"
                      aria-hidden
                    >
                      +
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <footer className="mt-4 flex flex-wrap items-center gap-3 text-[10px] text-[var(--muted-foreground)]">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--destructive)]"
            aria-hidden
          />
          &lt; 72h
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
            aria-hidden
          />
          Agendado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded ring-1 ring-[var(--primary)]"
            aria-hidden
          />
          Hoje
        </span>
      </footer>
    </div>
  );
}

function firstOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function buildMonthMatrix(viewMonth: Date): Date[] {
  const first = firstOfMonth(viewMonth);
  const startWeekday = first.getDay(); // 0 = Sunday
  const start = new Date(first);
  start.setDate(1 - startWeekday);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}
