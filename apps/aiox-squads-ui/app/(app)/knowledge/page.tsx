import { BookMarked } from "lucide-react";
import { PlaceholderPage } from "@/components/app-shell/placeholder-page";

export default function KnowledgePage() {
  return (
    <PlaceholderPage
      phase="Fase 3 · Knowledge Base"
      title="Knowledge base"
      description="Busca semântica em jurisprudência, súmulas, modelos e doutrina."
      icon={BookMarked}
    />
  );
}
