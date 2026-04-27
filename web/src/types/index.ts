export interface Product {
  No: string
  'Product Type': string
  Keywords: string
  'Primary Style Recommendation': string
  'Secondary Styles': string
  'Landing Page Pattern': string
  'Dashboard Style (if applicable)': string
  'Color Palette Focus': string
  'Key Considerations': string
}

export interface Style {
  'Style Category': string
  Type: string
  Keywords: string
  'Primary Colors': string
  'Secondary Colors': string
  'Effects & Animation': string
  'Best For': string
  'Do Not Use For': string
  'Light Mode ✓': string
  'Dark Mode ✓': string
  Performance: string
  Accessibility: string
  'Mobile-Friendly': string
  'Conversion-Focused': string
  'Framework Compatibility': string
  'Era/Origin': string
  Complexity: string
  'AI Prompt Keywords': string
  'CSS/Technical Keywords': string
  'Implementation Checklist': string
  'Design System Variables': string
}

export interface ColorPalette {
  No: string
  'Product Type': string
  'Primary Color': string
  'Secondary Color': string
  'Accent Color': string
  'Background Color': string
  'Text Color': string
  'Success Color': string
  'Error Color': string
  'Warning Color': string
  'Info Color': string
  'Mood Keywords': string
  'Best For': string
}

export interface Typography {
  No: string
  'Font Pair': string
  'Primary Font': string
  'Secondary Font': string
  'Google Fonts URL': string
  'Mood Keywords': string
  'Best For': string
  'Category': string
}

export interface DesignSystem {
  product_name: string
  product_type: string
  pattern?: string
  style?: string
  colors?: Record<string, string>
  typography?: {
    primary?: { family: string; weights: string[] }
    secondary?: { family: string; weights: string[] }
  }
  effects?: string
  antiPatterns?: string[]
  checklist?: string[]
  status?: string
  generatedAt?: string
}

export interface SearchResult {
  type: string
  matches: Product[] | Style[] | ColorPalette[]
}

export interface EditorState {
  selectedProduct: Product | null
  selectedStyle: Style | null
  selectedColors: ColorPalette | null
  selectedTypography: Typography | null
  selectedStack: string
  designSystem: DesignSystem | null
  darkMode: boolean
  loading: boolean
  error: string | null
}
