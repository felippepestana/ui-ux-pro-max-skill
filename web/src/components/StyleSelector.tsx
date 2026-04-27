import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { useDesignSystem } from '@/hooks/useDesignSystem'
import type { Style } from '@/types'

export const StyleSelector: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: styles, loading } = useApi<Style[]>('/api/styles')
  const { selectedStyle, setSelectedStyle } = useDesignSystem()

  const filteredStyles = useMemo(() => {
    if (!styles) return []
    if (!searchTerm) return styles

    return styles.filter(s =>
      s['Style Category'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.Keywords.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [styles, searchTerm])

  if (loading) return <div className="animate-pulse">Carregando estilos...</div>

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar estilos UI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {filteredStyles.map((style, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedStyle(style)}
            className={`p-4 text-left rounded-lg border-2 transition-all group ${
              selectedStyle?.['Style Category'] === style['Style Category']
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-slate-700 hover:border-purple-200'
            }`}
          >
            <div className="font-semibold text-sm flex items-center justify-between">
              {style['Style Category']}
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {style.Type}
              </span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
              {style['Best For']}
            </div>
          </button>
        ))}
      </div>

      {selectedStyle && (
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm">
          <div className="font-semibold mb-2">{selectedStyle['Style Category']}</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <strong>Performance:</strong> {selectedStyle.Performance}
            </div>
            <div>
              <strong>Acessibilidade:</strong> {selectedStyle.Accessibility}
            </div>
            <div className="col-span-2">
              <strong>Melhor para:</strong> {selectedStyle['Best For']}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
