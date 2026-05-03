"use client";

import * as React from "react";
import {
  CheckCircle2,
  Clock,
  Columns3,
  List,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";
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
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { TaskCard } from "@/components/tasks/task-card";
import {
  ASSIGNEES,
  PRIORITY_LABEL,
  PRIORITY_VARIANT,
  TASKS,
  TASK_STAGES,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/tasks";

type View = "kanban" | "list";

export default function TasksPage() {
  const [items, setItems] = React.useState<Task[]>(TASKS);
  const [view, setView] = React.useState<View>("kanban");
  const [search, setSearch] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState<TaskPriority | "all">(
    "all",
  );
  const [assigneeFilter, setAssigneeFilter] = React.useState<string>("all");

  const filtered = React.useMemo<Task[]>(() => {
    return items.filter((t) => {
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (assigneeFilter !== "all" && t.assignee.id !== assigneeFilter)
        return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack =
          `${t.title} ${t.matterCode} ${t.matterClient} ${t.assignee.name}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [items, search, priorityFilter, assigneeFilter]);

  function moveTask(id: string, status: TaskStatus) {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    const task = items.find((t) => t.id === id);
    const stage = TASK_STAGES.find((s) => s.key === status);
    if (task && stage) {
      toast(`${task.title}`, { description: `Movida para "${stage.label}"` });
    }
  }

  const stats = {
    total: items.length,
    doing: items.filter((t) => t.status === "doing").length,
    review: items.filter((t) => t.status === "review").length,
    overdue: items.filter(
      (t) =>
        t.status !== "done" &&
        t.hoursLeft !== undefined &&
        t.hoursLeft < 0,
    ).length,
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Trabalho jurídico · Tarefas
          </p>
          <h1 className="mt-1 font-serif text-4xl">Tarefas</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {stats.total} no total · <strong>{stats.doing}</strong> em andamento ·{" "}
            <strong>{stats.review}</strong> aguardando revisão ·{" "}
            {stats.overdue > 0 && (
              <span className="text-[var(--destructive)]">
                <strong>{stats.overdue}</strong> em atraso
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm">
            <Plus aria-hidden /> Nova tarefa
          </Button>
        </div>
      </header>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(220px,1fr)_180px_220px_auto]">
          <label className="relative">
            <span className="sr-only">Buscar tarefas</span>
            <Search
              aria-hidden
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]"
            />
            <Input
              placeholder="Buscar tarefas, casos, clientes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </label>
          <Select
            value={priorityFilter}
            onValueChange={(v) => setPriorityFilter(v as TaskPriority | "all")}
          >
            <SelectTrigger aria-label="Filtrar por prioridade">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as prioridades</SelectItem>
              {(Object.keys(PRIORITY_LABEL) as TaskPriority[]).map((p) => (
                <SelectItem key={p} value={p}>
                  {PRIORITY_LABEL[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger aria-label="Filtrar por responsável">
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os responsáveis</SelectItem>
              {ASSIGNEES.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div
            className="inline-flex h-10 items-center rounded-md border border-[var(--border)] bg-[var(--card)] p-1"
            role="tablist"
            aria-label="Modo de visualização"
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === "kanban"}
              onClick={() => setView("kanban")}
              className={`inline-flex h-8 items-center gap-1.5 rounded-sm px-3 text-xs font-medium transition-colors ${
                view === "kanban"
                  ? "bg-[var(--surface-primary)] text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <Columns3 className="h-3.5 w-3.5" aria-hidden /> Kanban
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "list"}
              onClick={() => setView("list")}
              className={`inline-flex h-8 items-center gap-1.5 rounded-sm px-3 text-xs font-medium transition-colors ${
                view === "list"
                  ? "bg-[var(--surface-primary)] text-[var(--primary)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              }`}
            >
              <List className="h-3.5 w-3.5" aria-hidden /> Lista
            </button>
          </div>
        </CardContent>
      </Card>

      {view === "kanban" ? (
        <KanbanBoard<Task, TaskStatus>
          items={filtered}
          stages={TASK_STAGES}
          getStage={(t) => t.status}
          getItemKey={(t) => t.id}
          renderCard={(t) => <TaskCard task={t} onMove={moveTask} />}
        />
      ) : (
        <TaskList tasks={filtered} onMove={moveTask} />
      )}
    </div>
  );
}

function TaskList({
  tasks,
  onMove,
}: {
  tasks: Task[];
  onMove: (id: string, status: TaskStatus) => void;
}) {
  const grouped = React.useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const t of tasks) {
      const k = t.assignee.id;
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(t);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="font-serif text-lg text-[var(--muted-foreground)]">
            Nenhuma tarefa nos filtros atuais.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {grouped.map(([assigneeId, assigneeTasks]) => {
        const assignee = ASSIGNEES.find((a) => a.id === assigneeId);
        if (!assignee) return null;
        return (
          <section key={assigneeId} aria-label={`Tarefas de ${assignee.name}`}>
            <header className="mb-3 flex items-center gap-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-primary)] text-xs font-semibold text-[var(--primary)]"
                aria-hidden
              >
                {assignee.initials}
              </span>
              <h2 className="font-serif text-lg font-semibold">{assignee.name}</h2>
              <Badge variant="outline">{assigneeTasks.length}</Badge>
            </header>
            <Card className="overflow-hidden">
              <ul>
                {assigneeTasks.map((t, idx) => (
                  <li
                    key={t.id}
                    className={
                      idx > 0 ? "border-t border-[var(--border)]" : undefined
                    }
                  >
                    <TaskRow task={t} onMove={onMove} />
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        );
      })}
    </div>
  );
}

function TaskRow({
  task,
  onMove,
}: {
  task: Task;
  onMove: (id: string, status: TaskStatus) => void;
}) {
  const stage = TASK_STAGES.find((s) => s.key === task.status);
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--muted)]/40">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{task.title}</p>
        <p className="font-mono text-[10px] text-[var(--primary)]">
          {task.matterCode} · {task.matterClient}
        </p>
      </div>
      <Badge variant={PRIORITY_VARIANT[task.priority]}>
        {PRIORITY_LABEL[task.priority]}
      </Badge>
      {task.hoursLeft !== undefined && task.status !== "done" && (
        <span
          className={
            task.hoursLeft < 0
              ? "inline-flex items-center gap-1 text-xs text-[var(--destructive)]"
              : task.hoursLeft <= 72
                ? "inline-flex items-center gap-1 text-xs text-[var(--warning)]"
                : "inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]"
          }
        >
          <Clock className="h-3 w-3" aria-hidden />
          {task.hoursLeft < 0
            ? `atrasada ${Math.abs(task.hoursLeft)}h`
            : `${task.hoursLeft}h`}
        </span>
      )}
      {task.status === "done" && (
        <Badge variant="success">
          <CheckCircle2 className="h-3 w-3" aria-hidden /> Concluída
        </Badge>
      )}
      <Select
        value={task.status}
        onValueChange={(v) => onMove(task.id, v as TaskStatus)}
      >
        <SelectTrigger className="h-8 w-36 text-xs">
          <SelectValue placeholder={stage?.label} />
        </SelectTrigger>
        <SelectContent>
          {TASK_STAGES.map((s) => (
            <SelectItem key={s.key} value={s.key}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
