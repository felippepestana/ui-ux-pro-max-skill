import { Mail, ShieldCheck, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MEMBERS,
  ROLE_DESCRIPTION,
  ROLE_LABEL,
  ROLE_VARIANT,
  ROLES,
} from "@/lib/team";

export const metadata = { title: "Equipe" };

export default function TeamPage() {
  const active = MEMBERS.filter((m) => m.status === "ativo");
  const invited = MEMBERS.filter((m) => m.status === "convidado");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
            Administração · Equipe
          </p>
          <h1 className="mt-1 font-serif text-4xl">Equipe & permissões</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {active.length} membros ativos · {invited.length} convites pendentes ·{" "}
            5 papéis (RBAC enforcement server-side em F6/F7).
          </p>
        </div>
        <Button variant="primary" size="sm">
          <UserPlus aria-hidden /> Convidar membro
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Papéis disponíveis (RBAC)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {ROLES.map((role) => (
              <li
                key={role}
                className="flex flex-col gap-2 rounded-md border border-[var(--border)] p-3"
              >
                <Badge variant={ROLE_VARIANT[role]}>{ROLE_LABEL[role]}</Badge>
                <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
                  {ROLE_DESCRIPTION[role]}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Membros ({MEMBERS.length})</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--muted)]/50 text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Membro</th>
                <th className="px-4 py-3 text-left font-semibold">Papel</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Entrou em</th>
                <th className="px-4 py-3 text-left font-semibold">Última atividade</th>
                <th className="px-4 py-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {MEMBERS.map((m) => (
                <tr
                  key={m.id}
                  className="border-t border-[var(--border)] hover:bg-[var(--muted)]/40"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-primary)] text-xs font-semibold text-[var(--primary)]"
                        aria-hidden
                      >
                        {m.initials}
                      </span>
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {m.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={ROLE_VARIANT[m.role]}>
                      <ShieldCheck className="h-3 w-3" aria-hidden />
                      {ROLE_LABEL[m.role]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        m.status === "ativo"
                          ? "success"
                          : m.status === "convidado"
                            ? "warning"
                            : "outline"
                      }
                    >
                      {m.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {new Date(m.joinedAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                    {m.lastActiveAt
                      ? new Date(m.lastActiveAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {m.status === "convidado" ? (
                      <Button variant="outline" size="sm">
                        <Mail aria-hidden /> Reenviar convite
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
