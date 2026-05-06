"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { SUPABASE_ENABLED } from "@/lib/env";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);

    if (!SUPABASE_ENABLED) {
      // Stub mode — match the previous form-action behavior.
      router.push("/login/mfa" as Route);
      return;
    }

    try {
      const { createSupabaseBrowserClient } = await import(
        "@/lib/supabase/client"
      );
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error("Falha no login", { description: error.message });
        return;
      }
      router.push("/workspace" as Route);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl">Entrar na sua conta</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Use seu e-mail profissional ou certificado digital. Você precisará de
          um segundo fator (MFA) configurado.
        </p>
        {!SUPABASE_ENABLED && (
          <p className="rounded-md border border-[var(--warning)]/40 bg-[var(--surface-warning)] p-2 text-[10px] text-[var(--warning)]">
            Modo stub — Supabase não configurado. Qualquer e-mail/senha
            avança para a tela de MFA.
          </p>
        )}
      </header>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="advogado@escritorio.adv.br"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              href={"/login" as Route}
              className="text-xs text-[var(--primary)] underline-offset-4 hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={pending}
        >
          {pending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Entrando…
            </>
          ) : (
            <>
              Continuar
              <ArrowRight aria-hidden />
            </>
          )}
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-[var(--muted-foreground)]">ou</span>
        <Separator className="flex-1" />
      </div>

      <Button variant="outline" className="w-full">
        Entrar com certificado digital
      </Button>

      <p className="text-center text-xs text-[var(--muted-foreground)]">
        Ao continuar, você concorda com os{" "}
        <a
          href="#"
          className="text-[var(--primary)] underline-offset-4 hover:underline"
        >
          Termos
        </a>{" "}
        e a{" "}
        <a
          href="#"
          className="text-[var(--primary)] underline-offset-4 hover:underline"
        >
          Política de Privacidade
        </a>
        .
      </p>
    </div>
  );
}
