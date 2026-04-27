import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/app-shell/placeholder-page";

export default function SettingsPage() {
  return (
    <PlaceholderPage
      phase="Fase 4 · Configurações"
      title="Configurações & integrações"
      description="OAB, certificado A1/A3, e-mail IMAP, PJe/Projudi/eproc, S3, Zapsign."
      icon={Settings}
    />
  );
}
