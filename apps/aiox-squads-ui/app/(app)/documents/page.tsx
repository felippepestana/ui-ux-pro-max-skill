import { FileText } from "lucide-react";
import { PlaceholderPage } from "@/components/app-shell/placeholder-page";

export default function DocumentsPage() {
  return (
    <PlaceholderPage
      phase="Fase 3 · Documentos"
      title="Documentos & drafts"
      description="Editor com IA, versionamento, tracked changes e assinatura digital."
      icon={FileText}
    />
  );
}
