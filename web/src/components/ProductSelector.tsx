import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useApi } from '@/hooks/useApi'
import { useDesignSystem } from '@/hooks/useDesignSystem'
import type { Product } from '@/types'

export const ProductSelector: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: products, loading } = useApi<Product[]>('/api/products')
  const { selectedProduct, setSelectedProduct } = useDesignSystem()

  const filteredProducts = useMemo(() => {
    if (!products) return []
    if (!searchTerm) return products

    return products.filter(p =>
      p['Product Type'].toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.Keywords.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  if (loading) return <div className="animate-pulse">Carregando produtos...</div>

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar produtos por tipo ou keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {filteredProducts.map((product) => (
          <button
            key={product.No}
            onClick={() => setSelectedProduct(product)}
            className={`p-4 text-left rounded-lg border-2 transition-all ${
              selectedProduct?.No === product.No
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-slate-700 hover:border-blue-200'
            }`}
          >
            <div className="font-semibold text-sm">{product['Product Type']}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {product.Keywords}
            </div>
          </button>
        ))}
      </div>

      {selectedProduct && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
          <div className="font-semibold mb-2">{selectedProduct['Product Type']}</div>
          <div className="text-gray-700 dark:text-gray-300">
            <strong>Estilo Recomendado:</strong> {selectedProduct['Primary Style Recommendation']}
          </div>
          <div className="text-gray-700 dark:text-gray-300 text-xs mt-2">
            {selectedProduct['Key Considerations']}
          </div>
        </div>
      )}
    </div>
  )
}
