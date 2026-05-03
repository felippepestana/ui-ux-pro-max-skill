"use client";

import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      theme="light"
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] shadow-[var(--shadow-md)] rounded-md",
          title: "font-serif text-sm font-semibold",
          description: "text-xs text-[var(--muted-foreground)]",
        },
      }}
      {...props}
    />
  );
}

export { toast } from "sonner";
