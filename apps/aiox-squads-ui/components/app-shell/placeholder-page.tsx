import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  phase: string;
}

export function PlaceholderPage({
  title,
  description,
  icon: Icon,
  phase,
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
          {phase}
        </p>
        <h1 className="mt-1 font-serif text-4xl">{title}</h1>
      </header>

      <Card className="max-w-2xl">
        <CardHeader className="flex-row items-center gap-4">
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-[var(--surface-primary)] text-[var(--primary)]"
            aria-hidden
          >
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <CardTitle>Em desenvolvimento</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--muted-foreground)]">
            Esta tela faz parte de uma fase futura da implementação. O esqueleto
            de navegação está pronto para que possamos iterar incrementalmente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
