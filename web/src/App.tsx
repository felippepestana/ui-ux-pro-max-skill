import { useEffect } from 'react'
import { Moon, Sun, RotateCcw } from 'lucide-react'
import { useDesignSystem } from './hooks/useDesignSystem'
import { ProductSelector } from './components/ProductSelector'
import { StyleSelector } from './components/StyleSelector'
import { ColorPaletteSelector } from './components/ColorPaletteSelector'
import { StackSelector } from './components/StackSelector'
import { DesignSystemPreview } from './components/DesignSystemPreview'
import './index.css'

function App() {
  const { darkMode, setDarkMode, reset, error } = useDesignSystem()

  useEffect(() => {
    // Aplica dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🎨 UI/UX Pro Max Editor</h1>
            <p className="text-blue-100 text-sm">Design System Visual Editor</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title={darkMode ? 'Modo claro' : 'Modo escuro'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={reset}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Resetar seleções"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-3 mt-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg border border-red-300 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Selectors */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>⚙️</span> Configurações
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300">
                    1. Tipo de Produto
                  </h3>
                  <ProductSelector />
                </div>

                <hr className="dark:border-slate-700" />

                <div>
                  <h3 className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300">
                    2. Estilo UI
                  </h3>
                  <StyleSelector />
                </div>

                <hr className="dark:border-slate-700" />

                <div>
                  <h3 className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300">
                    3. Stack Tecnológico
                  </h3>
                  <StackSelector />
                </div>
              </div>
            </div>
          </div>

          {/* Center - Colors and Design System */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
              <ColorPaletteSelector />
            </div>
          </div>

          {/* Right - Preview */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 sticky top-4">
              <DesignSystemPreview />
            </div>
          </div>
        </div>

        {/* Full Width - Design System Details (if generated) */}
        <div className="mt-8">
          {/* Additional panels can go here */}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-700 mt-12 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
        <p>UI/UX Pro Max Editor v2.5.0 • Desenvolvido com ❤️</p>
      </footer>
    </div>
  )
}

export default App
