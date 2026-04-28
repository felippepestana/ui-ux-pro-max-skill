import React from 'react'
import { useDesignSystem } from '@/hooks/useDesignSystem'

const STACKS = [
  { id: 'html-tailwind', name: 'HTML + Tailwind', icon: '🎨' },
  { id: 'react', name: 'React', icon: '⚛️' },
  { id: 'nextjs', name: 'Next.js', icon: '▲' },
  { id: 'vue', name: 'Vue', icon: '💚' },
  { id: 'svelte', name: 'Svelte', icon: '🔴' },
  { id: 'astro', name: 'Astro', icon: '🚀' },
  { id: 'nuxtjs', name: 'Nuxt.js', icon: '🟢' },
  { id: 'swiftui', name: 'SwiftUI', icon: '🍎' },
  { id: 'flutter', name: 'Flutter', icon: '💙' },
  { id: 'react-native', name: 'React Native', icon: '📱' },
  { id: 'shadcn-ui', name: 'shadcn/ui', icon: '✨' },
  { id: 'angular', name: 'Angular', icon: '🔴' },
]

export const StackSelector: React.FC = () => {
  const { selectedStack, setSelectedStack } = useDesignSystem()

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm">Stack Tecnológico</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {STACKS.map((stack) => (
          <button
            key={stack.id}
            onClick={() => setSelectedStack(stack.id)}
            className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
              selectedStack === stack.id
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-gray-200 dark:border-slate-700 hover:border-green-200'
            }`}
          >
            <div className="text-2xl">{stack.icon}</div>
            <div className="text-xs font-semibold text-center">{stack.name}</div>
          </button>
        ))}
      </div>

      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm">
        <strong>Stack Selecionado:</strong> {STACKS.find(s => s.id === selectedStack)?.name}
      </div>
    </div>
  )
}
