import { ShieldCheck } from "lucide-react";
import { PlaceholderPage } from "@/components/app-shell/placeholder-page";

export default function TeamPage() {
  return (
    <PlaceholderPage
      phase="Fase 4 · Equipe"
      title="Equipe & permissões"
      description="Sócios, associados, paralegais e clientes convidados com RBAC granular."
      icon={ShieldCheck}
    />
  );
}
