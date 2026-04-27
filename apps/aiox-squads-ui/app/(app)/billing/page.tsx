import { Receipt } from "lucide-react";
import { PlaceholderPage } from "@/components/app-shell/placeholder-page";

export default function BillingPage() {
  return (
    <PlaceholderPage
      phase="Fase 4 · Faturamento"
      title="Faturamento & time tracking"
      description="Time entries automáticos por execução de squad e geração de invoices."
      icon={Receipt}
    />
  );
}
