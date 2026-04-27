"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  ChevronsUpDown,
  HelpCircle,
  LogOut,
  Search,
  UserCircle2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommandMenu } from "@/components/app-shell/command-menu";

const PAGE_TITLES: Record<string, string> = {
  workspace: "Workspace",
  inbox: "Inbox HITL",
  matters: "Casos",
  squads: "Squads",
  agents: "Agentes",
  documents: "Documentos",
  knowledge: "Knowledge Base",
  clients: "Clientes",
  billing: "Faturamento",
  team: "Equipe",
  settings: "Configurações",
};

function useBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((segment, idx) => ({
    label: PAGE_TITLES[segment] ?? segment,
    href: `/${segments.slice(0, idx + 1).join("/")}`,
    isLast: idx === segments.length - 1,
  }));
}

function isMacPlatform() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
}

export function Topbar() {
  const breadcrumb = useBreadcrumb();
  const { setOpen } = useCommandMenu();
  const [shortcutKey, setShortcutKey] = React.useState("Ctrl");

  React.useEffect(() => {
    setShortcutKey(isMacPlatform() ? "⌘" : "Ctrl");
  }, []);

  return (
    <header
      className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-[var(--border)] bg-[var(--background)]/85 px-8 backdrop-blur"
      role="banner"
    >
      <nav aria-label="Trilha de navegação" className="min-w-0 flex-1">
        <ol className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          {breadcrumb.length === 0 && (
            <li className="font-serif text-base text-[var(--foreground)]">
              aiox-squads
            </li>
          )}
          {breadcrumb.map((crumb, idx) => (
            <li key={crumb.href} className="flex items-center gap-2">
              {idx > 0 && <span aria-hidden>/</span>}
              <span
                className={
                  crumb.isLast
                    ? "font-serif text-base font-semibold text-[var(--foreground)]"
                    : "hover:text-[var(--foreground)]"
                }
                aria-current={crumb.isLast ? "page" : undefined}
              >
                {crumb.label}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] md:inline-flex md:w-72"
        aria-label="Abrir paleta de comandos (atalho Cmd+K)"
      >
        <Search className="h-4 w-4" aria-hidden />
        <span className="flex-1 text-left">Buscar ou comandar…</span>
        <kbd className="rounded border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5 font-mono text-[10px] tracking-wider">
          {shortcutKey} K
        </kbd>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="hidden items-center gap-2 lg:inline-flex"
            aria-label="Trocar de escritório"
          >
            <Building2 className="h-4 w-4" aria-hidden />
            <span className="max-w-[140px] truncate">Pestana Adv.</span>
            <ChevronsUpDown className="h-3.5 w-3.5 text-[var(--muted-foreground)]" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Escritórios</DropdownMenuLabel>
          <DropdownMenuItem>
            <Building2 className="h-4 w-4" /> Pestana Adv.
            <Badge variant="default" className="ml-auto">
              Ativo
            </Badge>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Building2 className="h-4 w-4" /> Convidar escritório…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Notificações (3 não lidas)"
        className="relative"
      >
        <Bell className="h-4 w-4" aria-hidden />
        <span
          className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-[var(--accent)]"
          aria-hidden
        />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-90"
            aria-label="Menu da conta"
          >
            <Avatar>
              <AvatarFallback>FP</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel className="flex flex-col items-start gap-0.5 normal-case tracking-normal">
            <span className="font-serif text-sm font-semibold text-[var(--foreground)]">
              Felippe Pestana
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              felippe@pestana.adv.br
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserCircle2 className="h-4 w-4" /> Meu perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="h-4 w-4" /> Ajuda & atalhos
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-[var(--destructive)] focus:text-[var(--destructive)]">
            <LogOut className="h-4 w-4" /> Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
