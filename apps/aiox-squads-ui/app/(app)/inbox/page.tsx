import { Inbox } from "lucide-react";
import { PlaceholderPage } from "@/components/app-shell/placeholder-page";

export default function InboxPage() {
  return (
    <PlaceholderPage
      phase="Fase 1 · Inbox"
      title="Caixa de entrada"
      description="Aprovações HITL, prazos e notificações dos squads."
      icon={Inbox}
    />
  );
}
