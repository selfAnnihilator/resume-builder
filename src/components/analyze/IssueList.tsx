import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { ScoreResult } from '@/types/premium'

const SECTIONS = [
  { key: 'completeness', label: 'Completeness', color: 'indigo' },
  { key: 'content', label: 'Content Quality', color: 'purple' },
  { key: 'skills', label: 'Skills', color: 'teal' },
  { key: 'ats', label: 'ATS Compatibility', color: 'blue' },
] as const

const BAR_COLORS: Record<string, string> = {
  indigo: 'bg-indigo-500',
  purple: 'bg-purple-500',
  teal: 'bg-teal-500',
  blue: 'bg-blue-500',
}

const BADGE_COLORS: Record<string, string> = {
  indigo: 'bg-indigo-100 text-indigo-700',
  purple: 'bg-purple-100 text-purple-700',
  teal: 'bg-teal-100 text-teal-700',
  blue: 'bg-blue-100 text-blue-700',
}

interface Props {
  sections: ScoreResult['sections']
}

export function IssueList({ sections }: Props) {
  return (
    <div className="space-y-3">
      {SECTIONS.map(({ key, label, color }) => {
        const sec = sections[key]
        const pct = Math.round((sec.score / sec.max) * 100)
        return (
          <div key={key} className="rounded-xl border bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">{label}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${BADGE_COLORS[color]}`}>
                {sec.score}/{sec.max}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${BAR_COLORS[color]}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="space-y-1.5">
              {sec.issues.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <CheckCircle2 size={13} />
                  <span>Looks good!</span>
                </div>
              ) : (
                sec.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <AlertCircle size={13} className="text-amber-500 mt-0.5 shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
