"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSquadIcon } from "@/lib/squad-icons";
import { getSquadsForContext, type SquadContextType } from "@/lib/squads";

interface SquadLauncherButtonProps {
  contextType: SquadContextType;
  contextId: string;
  contextLabel: string;
}

export function SquadLauncherButton({
  contextType,
  contextLabel,
}: SquadLauncherButtonProps) {
  const router = useRouter();
  const squads = getSquadsForContext(contextType);

  if (squads.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="primary" size="sm">
          <Sparkles aria-hidden /> Disparar Squad
          <ChevronDown aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Para “{contextLabel}”</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {squads.map((squad) => {
          const Icon = getSquadIcon(squad.iconKey);
          return (
            <DropdownMenuItem
              key={squad.id}
              onSelect={() => router.push(`/squads/${squad.id}` as never)}
              className="flex items-start gap-3 py-2"
            >
              <span
                className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--surface-primary)] text-[var(--primary)]"
                aria-hidden
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{squad.name}</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {squad.tagline}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
