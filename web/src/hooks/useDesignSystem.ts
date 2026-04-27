import { create } from 'zustand'
import type { EditorState, Product, Style, ColorPalette, Typography, DesignSystem } from '@/types'

interface DesignSystemStore extends EditorState {
  setSelectedProduct: (product: Product | null) => void
  setSelectedStyle: (style: Style | null) => void
  setSelectedColors: (colors: ColorPalette | null) => void
  setSelectedTypography: (typography: Typography | null) => void
  setSelectedStack: (stack: string) => void
  setDesignSystem: (system: DesignSystem | null) => void
  setDarkMode: (darkMode: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useDesignSystem = create<DesignSystemStore>((set) => ({
  selectedProduct: null,
  selectedStyle: null,
  selectedColors: null,
  selectedTypography: null,
  selectedStack: 'html-tailwind',
  designSystem: null,
  darkMode: false,
  loading: false,
  error: null,

  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setSelectedStyle: (style) => set({ selectedStyle: style }),
  setSelectedColors: (colors) => set({ selectedColors: colors }),
  setSelectedTypography: (typography) => set({ selectedTypography: typography }),
  setSelectedStack: (stack) => set({ selectedStack: stack }),
  setDesignSystem: (system) => set({ designSystem: system }),
  setDarkMode: (darkMode) => set({ darkMode }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({
    selectedProduct: null,
    selectedStyle: null,
    selectedColors: null,
    selectedTypography: null,
    selectedStack: 'html-tailwind',
    designSystem: null,
    error: null,
  }),
}))
