"use client";

import * as React from "react";
import {
  Building2,
  CheckCircle2,
  Cog,
  KeyRound,
  Mail,
  ScrollText,
  ShieldCheck,
  Sparkles,
  User,
  Webhook,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type SectionKey =
  | "profile"
  | "office"
  | "integrations"
  | "api"
  | "webhooks"
  | "audit";

const SECTIONS: {
  key: SectionKey;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "profile",
    label: "Meu perfil",
    description: "Dados pessoais, MFA, preferências",
    icon: <User className="h-4 w-4" />,
  },
  {
    key: "office",
    label: "Escritório",
    description: "CNPJ, OAB, endereço, plano",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    key: "integrations",
    label: "Integrações",
    description: "OAB, certificado A1/A3, IMAP, PJe, S3, Zapsign",
    icon: <Cog className="h-4 w-4" />,
  },
  {
    key: "api",
    label: "API Keys",
    description: "Tokens para automações externas",
    icon: <KeyRound className="h-4 w-4" />,
  },
  {
    key: "webhooks",
    label: "Webhooks",
    description: "Eventos de saída (HITL aprovado, fatura paga…)",
    icon: <Webhook className="h-4 w-4" />,
  },
  {
    key: "audit",
    label: "Política de auditoria",
    description: "Retenção, LGPD, exportação",
    icon: <ScrollText className="h-4 w-4" />,
  },
];

export default function SettingsPage() {
  const [active, setActive] = React.useState<SectionKey>("profile");

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
          Administração · Configurações
        </p>
        <h1 className="mt-1 font-serif text-4xl">Configurações</h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Perfil, escritório, integrações com OAB/PJe/Zapsign e políticas de
          auditoria & LGPD.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside
          aria-label="Sub-navegação de configurações"
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-3"
        >
          <ul className="flex flex-col gap-0.5">
            {SECTIONS.map((s) => (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => setActive(s.key)}
                  aria-pressed={active === s.key}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors",
                    active === s.key
                      ? "bg-[var(--surface-primary)] text-[var(--primary)]"
                      : "hover:bg-[var(--muted)]",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                      active === s.key
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "bg-[var(--muted)] text-[var(--muted-foreground)]",
                    )}
                    aria-hidden
                  >
                    {s.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{s.label}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)]">
                      {s.description}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main>
          {active === "profile" && <ProfileSection />}
          {active === "office" && <OfficeSection />}
          {active === "integrations" && <IntegrationsSection />}
          {active === "api" && <ApiKeysSection />}
          {active === "webhooks" && <WebhooksSection />}
          {active === "audit" && <AuditPolicySection />}
        </main>
      </div>
    </div>
  );
}

function ProfileSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu perfil</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Field label="Nome">
          <Input defaultValue="Felippe Pestana" />
        </Field>
        <Field label="E-mail">
          <Input defaultValue="felippe@pestana.adv.br" type="email" />
        </Field>
        <Field label="OAB">
          <Input defaultValue="OAB/SP 123.456" />
        </Field>
        <Field label="Telefone">
          <Input defaultValue="+55 11 99999-9999" />
        </Field>
        <div className="md:col-span-2">
          <Separator className="my-2" />
          <div className="flex items-center justify-between rounded-md border border-[var(--border)] p-4">
            <div>
              <p className="font-medium">MFA (TOTP)</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Autenticação em duas etapas — obrigatório para sócios.
              </p>
            </div>
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3" aria-hidden /> Ativo
            </Badge>
          </div>
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button variant="primary">Salvar alterações</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OfficeSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escritório</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Field label="Razão social">
          <Input defaultValue="Pestana Sociedade Individual de Advocacia" />
        </Field>
        <Field label="CNPJ">
          <Input defaultValue="12.345.678/0001-90" />
        </Field>
        <Field label="OAB Sociedade">
          <Input defaultValue="OAB/SP S.A. 4.567" />
        </Field>
        <Field label="Plano">
          <Input defaultValue="Pro · 5 seats" disabled />
        </Field>
        <div className="md:col-span-2">
          <Field label="Endereço">
            <Input defaultValue="Av. Paulista, 1000, sala 1402 — São Paulo/SP" />
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

const INTEGRATIONS = [
  {
    key: "oab",
    name: "OAB Federal",
    description: "Validação automática de OABs de membros e clientes.",
    connected: true,
  },
  {
    key: "cert-a1",
    name: "Certificado digital A1",
    description: "Assinatura de petições e contratos por chave privada.",
    connected: true,
  },
  {
    key: "imap",
    name: "E-mail (IMAP)",
    description: "Anexar e-mails recebidos diretamente nos casos.",
    connected: true,
  },
  {
    key: "pje",
    name: "PJe (CNJ)",
    description: "Captura de intimações e movimentações processuais.",
    connected: false,
  },
  {
    key: "projudi",
    name: "Projudi",
    description: "Tribunais estaduais (PR, ES, AL, etc).",
    connected: false,
  },
  {
    key: "eproc",
    name: "eproc (TRFs)",
    description: "Tribunais Regionais Federais.",
    connected: false,
  },
  {
    key: "zapsign",
    name: "Zapsign",
    description: "Assinatura eletrônica de contratos.",
    connected: true,
  },
  {
    key: "s3",
    name: "Storage S3-compatible",
    description: "Backup criptografado de documentos.",
    connected: true,
  },
];

function IntegrationsSection() {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {INTEGRATIONS.map((i) => (
        <li key={i.key}>
          <Card className="h-full">
            <CardContent className="flex h-full flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <span
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-md",
                    i.connected
                      ? "bg-[var(--surface-success)] text-[var(--success)]"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)]",
                  )}
                  aria-hidden
                >
                  {i.connected ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                </span>
                <Badge variant={i.connected ? "success" : "outline"}>
                  {i.connected ? "Conectado" : "Desconectado"}
                </Badge>
              </div>
              <div>
                <p className="font-serif text-base font-semibold">{i.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {i.description}
                </p>
              </div>
              <div className="mt-auto pt-2">
                <Button
                  variant={i.connected ? "outline" : "primary"}
                  size="sm"
                  className="w-full"
                >
                  {i.connected ? "Configurar" : "Conectar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

function ApiKeysSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tokens de API</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-md border border-[var(--border)] p-4">
          <div className="min-w-0">
            <p className="font-medium">Token primário</p>
            <p className="font-mono text-xs text-[var(--muted-foreground)]">
              aiox_sk_••••••••••••••••a3f1
            </p>
          </div>
          <Button variant="outline" size="sm">
            Revelar
          </Button>
        </div>
        <Button variant="primary" size="sm" className="self-start">
          <Sparkles aria-hidden /> Criar novo token
        </Button>
      </CardContent>
    </Card>
  );
}

function WebhooksSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhooks de saída</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-[var(--muted-foreground)]">
          Receba notificações em tempo real sobre eventos do escritório:
          aprovação de HITL, fatura paga, novo lead recebido.
        </p>
        <Field label="URL do endpoint">
          <Input placeholder="https://seu-app.com/aiox/webhook" />
        </Field>
        <div className="rounded-md border border-[var(--border)] bg-[var(--muted)]/40 p-4 text-xs text-[var(--muted-foreground)]">
          Eventos disponíveis: <code>hitl.approved</code>,{" "}
          <code>invoice.paid</code>, <code>lead.created</code>,{" "}
          <code>squad.completed</code>, <code>deadline.due_soon</code>.
        </div>
      </CardContent>
    </Card>
  );
}

function AuditPolicySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Auditoria & LGPD</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <Row
          label="Retenção de logs de auditoria"
          value="5 anos"
          icon={<ShieldCheck className="h-4 w-4" aria-hidden />}
        />
        <Row
          label="Criptografia at-rest"
          value="AES-256"
          icon={<KeyRound className="h-4 w-4" aria-hidden />}
        />
        <Row
          label="DPO / Encarregado"
          value="dpo@pestana.adv.br"
          icon={<Mail className="h-4 w-4" aria-hidden />}
        />
        <Separator />
        <p className="text-xs text-[var(--muted-foreground)]">
          Solicitações de exportação ou eliminação de dados pessoais (LGPD)
          são processadas em até 15 dias e logadas na trilha de auditoria.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Exportar meus dados
          </Button>
          <Button variant="ghost" size="sm">
            Solicitar eliminação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-[var(--border)] p-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[var(--muted-foreground)]" aria-hidden>
          {icon}
        </span>
        {label}
      </div>
      <Badge variant="outline">{value}</Badge>
    </div>
  );
}
