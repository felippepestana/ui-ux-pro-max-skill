import { useState } from 'react'
import { Zap, Download, Copy, Smartphone, Tablet, Monitor } from 'lucide-react'
import { useDesignSystem } from '@/hooks/useDesignSystem'
import { useApiPost } from '@/hooks/useApi'

export const DesignSystemPreview: React.FC = () => {
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [exportFormat, setExportFormat] = useState('json')
  const [copied, setCopied] = useState(false)

  const {
    selectedProduct,
    selectedColors,
    selectedStack,
    designSystem,
    setDesignSystem,
    setLoading,
    setError,
  } = useDesignSystem()

  const handleGenerateDesignSystem = async () => {
    if (!selectedProduct) {
      setError('Selecione um produto primeiro')
      return
    }

    setLoading(true)
    try {
      const result = await useApiPost<any>('/api/design-system', {
        product_name: selectedProduct['Product Type'],
        product_type: selectedProduct['Product Type'],
        query: selectedProduct['Product Type'],
      })
      setDesignSystem(result as any)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar design system')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (!designSystem) return

    try {
      const result = await useApiPost('/api/export', {
        design_system: designSystem,
        format: exportFormat,
        stack: selectedStack,
      })

      const dataStr = JSON.stringify(result, null, 2)
      navigator.clipboard.writeText(dataStr)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao exportar')
    }
  }

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-sm'
      case 'tablet':
        return 'max-w-2xl'
      case 'desktop':
        return 'max-w-full'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Preview do Design System
        </h3>
        <button
          onClick={handleGenerateDesignSystem}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Gerar Design System
        </button>
      </div>

      {designSystem ? (
        <div className="space-y-4">
          {/* Seletor de Viewport */}
          <div className="flex gap-2 bg-gray-100 dark:bg-slate-800 p-2 rounded-lg">
            {[
              { key: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
              { key: 'tablet' as const, icon: Tablet, label: 'Tablet' },
              { key: 'desktop' as const, icon: Monitor, label: 'Desktop' },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setViewport(key)}
                className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewport === key
                    ? 'bg-white dark:bg-slate-700 text-blue-600'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Preview Area */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4">
            <div className={`mx-auto ${getViewportWidth()} transition-all duration-300`}>
              {/* Componente Button Preview */}
              <button
                className="w-full px-4 py-2 rounded-lg font-semibold transition-all mb-4"
                style={{
                  backgroundColor: selectedColors?.['Accent Color'] || '#3B82F6',
                  color: selectedColors?.['Text Color'] || '#FFFFFF',
                }}
              >
                Botão Primário
              </button>

              {/* Card Preview */}
              <div
                className="p-4 rounded-lg border-2 mb-4"
                style={{
                  backgroundColor: selectedColors?.['Background Color'] || '#F9FAFB',
                  borderColor: selectedColors?.['Primary Color'] || '#000000',
                  color: selectedColors?.['Text Color'] || '#000000',
                }}
              >
                <h4 className="font-semibold mb-2">Exemplo de Card</h4>
                <p className="text-sm opacity-75">
                  Este é um preview do design system gerado.
                </p>
              </div>

              {/* Cores */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Paleta de Cores
                </h5>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    selectedColors?.['Primary Color'],
                    selectedColors?.['Secondary Color'],
                    selectedColors?.['Accent Color'],
                    selectedColors?.['Success Color'],
                  ].map((color, idx) => (
                    <div
                      key={idx}
                      className="h-12 rounded border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="flex gap-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-sm"
            >
              <option value="json">JSON</option>
              <option value="css">CSS Variables</option>
              <option value="tailwind">Tailwind Config</option>
              <option value="js">JavaScript</option>
            </select>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <Copy className="w-4 h-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Exportar
                </>
              )}
            </button>
          </div>

          {/* Design System Details */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg text-xs space-y-2">
            <div>
              <strong>Produto:</strong> {designSystem.product_name}
            </div>
            <div>
              <strong>Stack:</strong> {selectedStack}
            </div>
            {designSystem.generatedAt && (
              <div>
                <strong>Gerado em:</strong> {designSystem.generatedAt}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          Selecione um produto e clique em "Gerar Design System" para começar
        </div>
      )}
    </div>
  )
}
