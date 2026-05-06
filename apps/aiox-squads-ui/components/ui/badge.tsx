import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--surface-primary)] text-[var(--primary)]",
        accent: "border-transparent bg-[var(--surface-accent)] text-[var(--accent)]",
        success: "border-transparent bg-[var(--surface-success)] text-[var(--success)]",
        warning: "border-transparent bg-[var(--surface-warning)] text-[var(--warning)]",
        info: "border-transparent bg-[var(--surface-info)] text-[var(--info)]",
        destructive: "border-transparent bg-[var(--surface-destructive)] text-[var(--destructive)]",
        outline: "border-[var(--border)] text-[var(--foreground)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
