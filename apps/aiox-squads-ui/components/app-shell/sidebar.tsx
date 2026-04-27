"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Users2,
  FileText,
  BookMarked,
  UserSquare2,
  Receipt,
  ShieldCheck,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * With `experimental.typedRoutes` enabled in next.config.ts, `Route` is a
 * branded string of paths known at build time, so links to non-existent
 * routes fail to type-check.
 */
type NavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV: NavSection[] = [
  {
    title: "Operação",
    items: [
      { href: "/workspace", label: "Workspace", icon: LayoutDashboard },
      { href: "/inbox", label: "Inbox", icon: Inbox, badge: 3 },
    ],
  },
  {
    title: "Trabalho jurídico",
    items: [
      { href: "/matters", label: "Casos", icon: Briefcase },
      { href: "/squads", label: "Squads", icon: Users2 },
      { href: "/agents", label: "Agentes", icon: Sparkles },
      { href: "/documents", label: "Documentos", icon: FileText },
      { href: "/knowledge", label: "Knowledge Base", icon: BookMarked },
    ],
  },
  {
    title: "Negócio",
    items: [
      { href: "/clients", label: "Clientes", icon: UserSquare2 },
      { href: "/billing", label: "Faturamento", icon: Receipt },
    ],
  },
  {
    title: "Administração",
    items: [
      { href: "/team", label: "Equipe", icon: ShieldCheck },
      { href: "/settings", label: "Configurações", icon: Settings },
    ],
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-64 shrink-0 flex-col border-r bg-[var(--sidebar)] text-[var(--sidebar-foreground)]",
        className
      )}
      style={{ borderColor: "var(--sidebar-border)" }}
      aria-label="Navegação principal"
    >
      <div className="flex h-16 items-center gap-2 border-b border-[var(--sidebar-border)] px-5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--primary)] text-[var(--primary-foreground)]"
          aria-hidden
        >
          <span className="font-serif text-lg font-semibold">a</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-serif text-base font-semibold">aiox-squads</span>
          <span className="text-xs text-[var(--sidebar-muted)]">
            Legal Intelligence
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((section) => (
          <div key={section.title} className="mb-5 last:mb-0">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--sidebar-muted)]">
              {section.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] font-medium"
                          : "text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)]/60"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active
                            ? "text-[var(--sidebar-accent-foreground)]"
                            : "text-[var(--sidebar-muted)] group-hover:text-[var(--sidebar-foreground)]"
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent-foreground)]"
                          aria-label={`${item.badge} pendentes`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--sidebar-border)] p-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--navy-100)] text-sm font-semibold text-[var(--navy-700)]"
            aria-hidden
          >
            FP
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Felippe Pestana</p>
            <p className="truncate text-xs text-[var(--sidebar-muted)]">
              Sócio · Pestana Adv.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
