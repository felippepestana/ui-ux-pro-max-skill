import { SquadCard } from "@/components/squads/squad-card";
import { SQUADS } from "@/lib/squads";

export const metadata = { title: "Squads" };

export default function SquadsCatalogPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
          Automação
        </p>
        <h1 className="mt-1 font-serif text-4xl">Catálogo de Squads</h1>
        <p className="mt-2 max-w-3xl text-base text-[var(--muted-foreground)]">
          Pipelines de agentes IA prontos para operar dentro dos seus casos,
          documentos e leads. Toda execução passa por revisão humana antes de
          virar artefato persistido.
        </p>
      </header>

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SQUADS.map((squad) => (
          <li key={squad.id} className="flex">
            <SquadCard squad={squad} />
          </li>
        ))}
      </ul>
    </div>
  );
}
