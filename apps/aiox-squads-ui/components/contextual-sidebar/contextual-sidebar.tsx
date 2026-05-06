"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ContextualSidebar — generic right-rail with collapsible sections.
 * Used in /matters/[id], /clients/[id], /leads/[id], /documents/[id].
 *
 * `icon` accepts a ReactNode so this Client Component receives only
 * serialisable props (RSC boundary respected — pass <Icon /> from the
 * server caller instead of the component reference).
 */
export type ContextualSidebarSection = {
  key: string;
  label: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  content: React.ReactNode;
};

interface ContextualSidebarProps {
  sections: ContextualSidebarSection[];
  className?: string;
}

export function ContextualSidebar({
  sections,
  className,
}: ContextualSidebarProps) {
  return (
    <aside
      aria-label="Sidebar contextual"
      className={cn(
        "sticky top-20 flex h-fit w-full max-w-sm shrink-0 flex-col gap-2 self-start",
        className,
      )}
    >
      {sections.map((section) => (
        <ContextualSection key={section.key} section={section} />
      ))}
    </aside>
  );
}

function ContextualSection({ section }: { section: ContextualSidebarSection }) {
  const [open, setOpen] = React.useState(section.defaultOpen ?? true);

  return (
    <section
      className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]"
      aria-labelledby={`section-${section.key}-trigger`}
    >
      <button
        id={`section-${section.key}-trigger`}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={`section-${section.key}-content`}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--muted)]"
      >
        <span
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--surface-primary)] text-[var(--primary)]"
          aria-hidden
        >
          {section.icon}
        </span>
        <span className="flex-1 font-serif text-sm font-semibold">
          {section.label}
        </span>
        {section.badge && (
          <span className="text-xs text-[var(--muted-foreground)]">
            {section.badge}
          </span>
        )}
        <ChevronDown
          aria-hidden
          className={cn(
            "h-4 w-4 shrink-0 text-[var(--muted-foreground)] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div
          id={`section-${section.key}-content`}
          className="border-t border-[var(--border)] px-4 py-3"
        >
          {section.content}
        </div>
      )}
    </section>
  );
}
