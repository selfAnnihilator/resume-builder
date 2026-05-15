import { Lightbulb, Tag } from 'lucide-react'
import { BulletSuggestion } from '@/types/premium'

interface Props {
  bulletSuggestions: BulletSuggestion[]
  suggestedKeywords: string[]
}

export function SuggestionsPanel({ bulletSuggestions, suggestedKeywords }: Props) {
  const hasBullets = bulletSuggestions.length > 0
  const hasKeywords = suggestedKeywords.length > 0

  if (!hasBullets && !hasKeywords) return null

  return (
    <div className="space-y-4">
      {hasBullets && (
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={16} className="text-amber-500" />
            <h3 className="font-semibold text-gray-900 text-sm">Bullet Point Tips</h3>
          </div>
          <div className="space-y-3">
            {bulletSuggestions.map((s, i) => (
              <div key={i} className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                  <span className="font-medium text-gray-700">Original:</span> {s.original}
                </p>
                <p className="text-xs text-amber-800">
                  <span className="font-medium">Tip:</span> {s.tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasKeywords && (
        <div className="rounded-2xl border bg-white p-6">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={16} className="text-indigo-500" />
            <h3 className="font-semibold text-gray-900 text-sm">Keywords to Consider Adding</h3>
          </div>
          <p className="text-xs text-gray-500 mb-3">Common ATS keywords not found in your resume:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedKeywords.map((kw) => (
              <span key={kw} className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
