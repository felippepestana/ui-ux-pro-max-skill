import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { useDesignSystem } from '@/hooks/useDesignSystem'
import type { ColorPalette } from '@/types'

export const ColorPaletteSelector: React.FC = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const { data: palettes, loading } = useApi<ColorPalette[]>('/api/colors')
  const { selectedColors, setSelectedColors } = useDesignSystem()

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  if (loading) return <div className="animate-pulse">Carregando paletas...</div>

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Paletas de Cores</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {palettes?.slice(0, 20).map((palette, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedColors(palette)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedColors?.No === palette.No
                ? 'border-yellow-500 ring-2 ring-yellow-300 dark:ring-yellow-600'
                : 'border-gray-200 dark:border-slate-700'
            }`}
          >
            <div className="flex gap-1 mb-2">
              {[
                palette['Primary Color'],
                palette['Secondary Color'],
                palette['Accent Color'],
              ].map((color, i) => (
                <div
                  key={i}
                  className="flex-1 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopyColor(color)
                  }}
                />
              ))}
            </div>
            <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
              {palette['Product Type']}
            </div>
          </button>
        ))}
      </div>

      {selectedColors && (
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-lg space-y-3">
          <h4 className="font-semibold text-sm">{selectedColors['Product Type']}</h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Primária', color: selectedColors['Primary Color'] },
              { label: 'Secundária', color: selectedColors['Secondary Color'] },
              { label: 'Acento', color: selectedColors['Accent Color'] },
              { label: 'Fundo', color: selectedColors['Background Color'] },
              { label: 'Texto', color: selectedColors['Text Color'] },
              { label: 'Sucesso', color: selectedColors['Success Color'] },
              { label: 'Erro', color: selectedColors['Error Color'] },
              { label: 'Aviso', color: selectedColors['Warning Color'] },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleCopyColor(item.color)}
                className="flex flex-col gap-2 p-2 bg-white dark:bg-slate-700 rounded hover:shadow-md transition-all"
                title={`Clique para copiar ${item.color}`}
              >
                <div
                  className="h-12 rounded border-2 border-gray-200 dark:border-gray-600"
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono flex items-center justify-center gap-1">
                  {copiedColor === item.color ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      {item.color}
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-3 p-2 bg-white dark:bg-slate-700 rounded text-xs text-gray-600 dark:text-gray-300">
            <strong>Mood:</strong> {selectedColors['Mood Keywords']}
          </div>
        </div>
      )}
    </div>
  )
}
