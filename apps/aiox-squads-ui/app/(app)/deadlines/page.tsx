import { Clock } from "lucide-react";
import { PlaceholderPage } from "@/components/app-shell/placeholder-page";

export default function DeadlinesPage() {
  return (
    <PlaceholderPage
      phase="Fase 4 · Prazos"
      title="Prazos"
      description="Calendário visual + lista crítica < 72h. v1: input manual. v1.5: regra forense BR (feriados nacionais + tribunal)."
      icon={Clock}
    />
  );
}
