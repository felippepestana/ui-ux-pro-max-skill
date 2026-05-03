"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { CheckCircle2, Clock, MoreHorizontal, ChevronRight } from "lucide-react";
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
import {
  TASK_STAGES,
  type Task,
  type TaskStatus,
  PRIORITY_VARIANT,
  PRIORITY_LABEL,
} from "@/lib/tasks";

interface TaskCardProps {
  task: Task;
  onMove: (taskId: string, status: TaskStatus) => void;
}

export function TaskCard({ task, onMove }: TaskCardProps) {
  const router = useRouter();
  const checklist = task.checklist ?? [];
  const checklistDone = checklist.filter((c) => c.done).length;

  const isOverdue =
    task.hoursLeft !== undefined && task.hoursLeft < 0 && task.status !== "done";
  const isCritical =
    !isOverdue &&
    task.hoursLeft !== undefined &&
    task.hoursLeft <= 72 &&
    task.status !== "done";

  return (
    <article className="flex flex-col gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] p-3 shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--primary)]/40">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => router.push(`/matters/${task.matterId}` as Route)}
          className="min-w-0 flex-1 text-left"
        >
          <p className="line-clamp-2 text-sm font-medium leading-snug">
            {task.title}
          </p>
          <p className="mt-1 truncate font-mono text-[10px] text-[var(--primary)]">
            {task.matterCode} · {task.matterClient}
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
            {TASK_STAGES.filter((s) => s.key !== task.status).map((s) => (
              <DropdownMenuItem
                key={s.key}
                onSelect={() => onMove(task.id, s.key)}
              >
                {s.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => router.push(`/matters/${task.matterId}` as Route)}
            >
              Ver caso
              <ChevronRight className="ml-auto h-3.5 w-3.5" aria-hidden />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant={PRIORITY_VARIANT[task.priority]} className="text-[10px]">
          {PRIORITY_LABEL[task.priority]}
        </Badge>
        {task.dependsOnId && (
          <Badge variant="outline" className="text-[10px]">
            depende
          </Badge>
        )}
        {checklist.length > 0 && (
          <Badge variant="outline" className="text-[10px]">
            <CheckCircle2 className="h-3 w-3" aria-hidden />
            {checklistDone}/{checklist.length}
          </Badge>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 text-[10px]">
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--surface-primary)] font-mono font-semibold text-[var(--primary)]"
          aria-label={task.assignee.name}
          title={task.assignee.name}
        >
          {task.assignee.initials}
        </span>
        {task.hoursLeft !== undefined && (
          <span
            className={
              isOverdue
                ? "inline-flex items-center gap-1 text-[var(--destructive)]"
                : isCritical
                  ? "inline-flex items-center gap-1 text-[var(--warning)]"
                  : "inline-flex items-center gap-1 text-[var(--muted-foreground)]"
            }
          >
            <Clock className="h-3 w-3" aria-hidden />
            {isOverdue
              ? `atrasada ${Math.abs(task.hoursLeft)}h`
              : `${task.hoursLeft}h`}
          </span>
        )}
      </div>
    </article>
  );
}
