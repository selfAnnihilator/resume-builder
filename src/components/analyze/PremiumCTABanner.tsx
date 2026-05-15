import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { ScoreResult } from '@/types/premium'

interface Props {
  score: number
  label: ScoreResult['label']
}

export function PremiumCTABanner({ score, label }: Props) {
  const message =
    label === 'Strong'
      ? `Your resume scores ${score}/100 — strong, but AI can still find hidden improvements.`
      : label === 'Good'
      ? `Your resume scores ${score}/100. AI analysis can identify what's holding you back.`
      : `Your resume scores ${score}/100. Get AI-powered rewrites to fix the issues above.`

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-indigo-600 p-2.5 shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">Get AI-Powered Resume Optimization</h3>
          <p className="text-sm text-gray-600 mb-4">{message}</p>
          <ul className="space-y-1 mb-5">
            {[
              'Rewritten bullet points with action verbs & metrics',
              '3 missing ATS keywords identified for your role',
              'Detailed written feedback from AI reviewer',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <Link
              href="/optimize"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
            >
              <Sparkles size={14} />
              Unlock AI Review — $4.99
            </Link>
            <span className="text-xs text-gray-400">One-time · No subscription</span>
          </div>
        </div>
      </div>
    </div>
  )
}
