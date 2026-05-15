'use client'

import { useState } from 'react'
import { Copy, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AIFeedback } from '@/types/premium'
import Link from 'next/link'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i <= rating ? 'bg-amber-400' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 px-2 text-xs gap-1">
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </Button>
  )
}

interface Props {
  data: AIFeedback
}

export function AIFeedbackPanel({ data }: Props) {
  return (
    <div className="space-y-8">
      {/* Overall Feedback */}
      <div className="rounded-xl border bg-white p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Overall Assessment</h2>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
            AI Score: {data.atsScore}/100
          </span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{data.overallFeedback}</p>
      </div>

      {/* Bullet Improvements */}
      {data.bulletImprovements.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">Bullet Point Improvements</h2>
          {data.bulletImprovements.map((item, i) => (
            <div key={i} className="rounded-xl border bg-white p-4 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Original</span>
                  <StarRating rating={item.rating} />
                </div>
                <p className="text-sm text-gray-500">{item.original}</p>
              </div>
              <div className="border-t pt-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">Improved</span>
                  <CopyButton text={item.improved} />
                </div>
                <p className="text-sm text-indigo-800 font-medium">{item.improved}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Missing Keywords + Top Issues */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.missingKeywords.length > 0 && (
          <div className="rounded-xl border bg-white p-5 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Missing ATS Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {data.missingKeywords.map((kw) => (
                <span key={kw} className="px-2.5 py-1 rounded-full text-xs border border-indigo-200 text-indigo-700 bg-indigo-50 font-medium">
                  + {kw}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400">Add these to your Skills section</p>
          </div>
        )}

        {data.topIssues.length > 0 && (
          <div className="rounded-xl border bg-white p-5 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Top Issues to Fix</h3>
            <ol className="space-y-2">
              {data.topIssues.map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <AlertCircle size={13} className="text-amber-500 mt-0.5 shrink-0" />
                  {issue}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="text-center py-4">
        <p className="text-sm text-gray-500 mb-3">Ready to apply these improvements?</p>
        <Link
          href="/editor"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          Back to Editor →
        </Link>
      </div>
    </div>
  )
}
