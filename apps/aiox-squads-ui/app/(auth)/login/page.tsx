import Link from "next/link";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl">Entrar na sua conta</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Use seu e-mail profissional ou certificado digital. Você precisará de
          um segundo fator (MFA) configurado.
        </p>
      </header>

      <form className="flex flex-col gap-4" action="/login/mfa">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="advogado@escritorio.adv.br"
            required
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
          />
        </div>
        <Button type="submit" variant="primary" className="w-full">
          Continuar
          <ArrowRight aria-hidden />
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
