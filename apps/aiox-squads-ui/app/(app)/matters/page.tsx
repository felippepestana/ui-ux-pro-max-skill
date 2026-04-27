import { Briefcase } from "lucide-react";
import { PlaceholderPage } from "@/components/app-shell/placeholder-page";

export default function MattersPage() {
  return (
    <PlaceholderPage
      phase="Fase 2 · Casos"
      title="Casos"
      description="DataTable virtualizada com filtros por área, prazo, cliente e responsável."
      icon={Briefcase}
    />
  );
}
