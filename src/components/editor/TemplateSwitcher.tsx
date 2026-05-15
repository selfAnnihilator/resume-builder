'use client'

import { useResumeStore } from '@/lib/store'
import { TemplateId } from '@/types/resume'
import { cn } from '@/lib/utils'

const templates: { id: TemplateId; label: string }[] = [
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'professional', label: 'Professional' },
]

export function TemplateSwitcher() {
  const { activeTemplate, setActiveTemplate } = useResumeStore()

  return (
    <div className="flex gap-2">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => setActiveTemplate(t.id)}
          className={cn(
            'px-3 py-1.5 rounded text-sm font-medium border transition-colors',
            activeTemplate === t.id
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
