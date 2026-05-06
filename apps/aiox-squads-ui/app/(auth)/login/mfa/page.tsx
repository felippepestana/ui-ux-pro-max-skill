"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const OTP_LEN = 6;

export default function MFAPage() {
  const [digits, setDigits] = React.useState<string[]>(() =>
    Array.from({ length: OTP_LEN }, () => ""),
  );
  const inputs = React.useRef<Array<HTMLInputElement | null>>([]);

  function setDigitAt(idx: number, value: string) {
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  }

  function handleChange(idx: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "").slice(-1);
      if (!value) return setDigitAt(idx, "");
      setDigitAt(idx, value);
      const next = inputs.current[idx + 1];
      if (next) next.focus();
    };
  }

  function handleKeyDown(idx: number) {
    return (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && digits[idx] === "" && idx > 0) {
        const prev = inputs.current[idx - 1];
        if (prev) prev.focus();
      }
    };
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.slice(0, OTP_LEN).split("");
    setDigits(
      Array.from({ length: OTP_LEN }, (_, i) => next[i] ?? ""),
    );
    const focusIndex = Math.min(next.length, OTP_LEN - 1);
    inputs.current[focusIndex]?.focus();
  }

  const code = digits.join("");
  const isComplete = code.length === OTP_LEN;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-primary)] text-[var(--primary)]">
          <ShieldCheck className="h-5 w-5" aria-hidden />
        </span>
        <h1 className="font-serif text-3xl">Verificação em duas etapas</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Digite o código de 6 dígitos do seu app autenticador (Google
          Authenticator, 1Password, Authy).
        </p>
      </header>

      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          /* TODO Fase 4: integrar com next-auth */
        }}
      >
        <fieldset className="flex flex-col gap-2">
          <Label htmlFor="otp-0" className="sr-only">
            Código de verificação
          </Label>
          <div
            className="flex items-center justify-between gap-2"
            role="group"
            aria-label="Código de verificação de 6 dígitos"
          >
            {digits.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                ref={(el) => {
                  inputs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                autoComplete={idx === 0 ? "one-time-code" : "off"}
                value={digit}
                onChange={handleChange(idx)}
                onKeyDown={handleKeyDown(idx)}
                onPaste={idx === 0 ? handlePaste : undefined}
                className={cn(
                  "h-14 w-12 rounded-md border border-[var(--input)] bg-[var(--background)] text-center font-mono text-xl font-semibold",
                  "focus:border-[var(--ring)] focus:outline-none",
                )}
                aria-label={`Dígito ${idx + 1} de ${OTP_LEN}`}
              />
            ))}
          </div>
        </fieldset>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={!isComplete}
        >
          Verificar e entrar
        </Button>

        <button
          type="button"
          className="text-center text-xs text-[var(--muted-foreground)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
        >
          Reenviar código por SMS
        </button>
      </form>
    </div>
  );
}
