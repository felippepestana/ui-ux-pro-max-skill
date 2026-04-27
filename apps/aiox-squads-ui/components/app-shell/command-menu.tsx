"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import {
  Briefcase,
  BookMarked,
  FileText,
  Inbox,
  LayoutDashboard,
  Plus,
  Receipt,
  Settings,
  ShieldCheck,
  Sparkles,
  UserSquare2,
  Users2,
  type LucideIcon,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

type NavCommand = { label: string; href: Route; icon: LucideIcon };
type ActionCommand = {
  label: string;
  description: string;
  icon: LucideIcon;
  shortcut?: string;
  onSelect: () => void;
};

const NAV_COMMANDS: NavCommand[] = [
  { label: "Workspace", href: "/workspace", icon: LayoutDashboard },
  { label: "Inbox HITL", href: "/inbox", icon: Inbox },
  { label: "Casos", href: "/matters", icon: Briefcase },
  { label: "Squads", href: "/squads", icon: Users2 },
  { label: "Agentes", href: "/agents", icon: Sparkles },
  { label: "Documentos", href: "/documents", icon: FileText },
  { label: "Knowledge Base", href: "/knowledge", icon: BookMarked },
  { label: "Clientes", href: "/clients", icon: UserSquare2 },
  { label: "Faturamento", href: "/billing", icon: Receipt },
  { label: "Equipe", href: "/team", icon: ShieldCheck },
  { label: "Configurações", href: "/settings", icon: Settings },
];

interface CommandMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandMenuContext = React.createContext<CommandMenuContextValue | null>(
  null,
);

export function useCommandMenu() {
  const ctx = React.useContext(CommandMenuContext);
  if (!ctx) {
    throw new Error("useCommandMenu must be used within <CommandMenuProvider>");
  }
  return ctx;
}

export function CommandMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const runCommand = React.useCallback((cb: () => void) => {
    setOpen(false);
    cb();
  }, []);

  const ACTION_COMMANDS: ActionCommand[] = React.useMemo(
    () => [
      {
        label: "Novo caso",
        description: "Criar caso e vincular a um cliente",
        icon: Plus,
        shortcut: "N",
        onSelect: () => runCommand(() => router.push("/matters")),
      },
      {
        label: "Iniciar squad",
        description: "Disparar pipeline de agentes IA",
        icon: Sparkles,
        shortcut: "S",
        onSelect: () => runCommand(() => router.push("/squads")),
      },
      {
        label: "Convidar membro",
        description: "Adicionar advogado, paralegal ou cliente",
        icon: ShieldCheck,
        onSelect: () => runCommand(() => router.push("/team")),
      },
    ],
    [router, runCommand],
  );

  return (
    <CommandMenuContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar comandos, casos, squads…" />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

          <CommandGroup heading="Ações rápidas">
            {ACTION_COMMANDS.map((action) => {
              const Icon = action.icon;
              return (
                <CommandItem
                  key={action.label}
                  value={`${action.label} ${action.description}`}
                  onSelect={action.onSelect}
                >
                  <Icon aria-hidden />
                  <span>{action.label}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {action.description}
                  </span>
                  {action.shortcut && (
                    <CommandShortcut>{action.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navegar para">
            {NAV_COMMANDS.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.href}
                  value={item.label}
                  onSelect={() => runCommand(() => router.push(item.href))}
                >
                  <Icon aria-hidden />
                  <span>{item.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </CommandMenuContext.Provider>
  );
}
