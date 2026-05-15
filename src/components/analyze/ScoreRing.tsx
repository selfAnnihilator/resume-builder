import { ScoreResult } from '@/types/premium'

const RADIUS = 50
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const COLORS: Record<ScoreResult['label'], string> = {
  Weak: '#ef4444',
  Fair: '#f59e0b',
  Good: '#3b82f6',
  Strong: '#22c55e',
}

interface Props {
  score: number
  label: ScoreResult['label']
}

export function ScoreRing({ score, label }: Props) {
  const filled = (score / 100) * CIRCUMFERENCE
  const color = COLORS[label]

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 120 120" className="w-40 h-40">
        <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="54" textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="bold" fill="#111827">
          {score}
        </text>
        <text x="60" y="72" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#6b7280">
          out of 100
        </text>
      </svg>
      <span
        className="px-3 py-1 rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        {label}
      </span>
      <p className="text-xs text-gray-500 text-center max-w-[160px]">
        {label === 'Strong' && 'Excellent resume! Minor tweaks can still help.'}
        {label === 'Good' && 'Solid resume. Fix the flagged issues to stand out.'}
        {label === 'Fair' && 'Needs work. Address the issues below to improve.'}
        {label === 'Weak' && 'Several critical sections are incomplete or missing.'}
      </p>
    </div>
  )
}
