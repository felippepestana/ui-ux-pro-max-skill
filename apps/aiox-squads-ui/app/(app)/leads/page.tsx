import { Sparkles } from "lucide-react";
import { PlaceholderPage } from "@/components/app-shell/placeholder-page";

export default function LeadsPage() {
  return (
    <PlaceholderPage
      phase="Fase 3 · CRM/Pipeline"
      title="Leads"
      description="Pipeline Kanban de oportunidades — qualificação, proposta, conversão em cliente + caso. Squad de Triagem dispara aqui."
      icon={Sparkles}
    />
  );
}
