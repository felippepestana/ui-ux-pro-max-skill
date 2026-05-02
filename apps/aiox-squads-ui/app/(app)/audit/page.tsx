import { ScrollText } from "lucide-react";
import { PlaceholderPage } from "@/components/app-shell/placeholder-page";

export default function AuditPage() {
  return (
    <PlaceholderPage
      phase="Fase 7 · Auditoria"
      title="Auditoria"
      description="Trilhas de mutação por entidade/usuário/intervalo. Origem human|squad|system. Drill-in para diff antes/depois."
      icon={ScrollText}
    />
  );
}
