import { ListChecks } from "lucide-react";
import { PlaceholderPage } from "@/components/app-shell/placeholder-page";

export default function TasksPage() {
  return (
    <PlaceholderPage
      phase="Fase 4 · Tarefas"
      title="Tarefas"
      description="Kanban + Lista por responsável, com vínculo a casos e prazos. Filtros por prioridade e dependência."
      icon={ListChecks}
    />
  );
}
