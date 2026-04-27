/**
 * aiox-squads — Design Tokens (TypeScript mirror of tokens.css)
 *
 * Use this file when you need tokens in JS/TS land (charts, JS animations,
 * canvas rendering). For all CSS/Tailwind work, prefer the CSS variables.
 */

export const palette = {
  navy: {
    50: "#EFF2F9",
    100: "#DCE3F1",
    200: "#B9C7E3",
    300: "#8FA4D2",
    400: "#5E78BF",
    500: "#3855A8",
    600: "#1E40AF",
    700: "#1E3A8A",
    800: "#172E6E",
    900: "#0F1F4D",
    950: "#08122E",
  },
  gold: {
    50: "#FBF6EC",
    100: "#F5E9CE",
    200: "#ECD49C",
    300: "#DDB561",
    400: "#C99632",
    500: "#B45309",
    600: "#944308",
    700: "#743406",
    800: "#552604",
    900: "#361702",
  },
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    150: "#E9EEF5",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
    950: "#020617",
  },
  status: {
    success: "#16A34A",
    warning: "#CA8A04",
    info: "#0EA5E9",
    destructive: "#DC2626",
  },
} as const;

export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const fontFamily = {
  sans: ["var(--font-sans)", "system-ui", "sans-serif"],
  serif: ["var(--font-serif)", "Georgia", "serif"],
} as const;

export type Palette = typeof palette;
export type Space = typeof space;
export type Radius = typeof radius;
