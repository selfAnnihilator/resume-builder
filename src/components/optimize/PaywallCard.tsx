'use client'

import { useState } from 'react'
import { Lock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PaywallCard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleUnlock() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to create checkout session.')
      const { url } = await res.json()
      window.location.href = url
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-2xl border bg-white p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-indigo-100 p-4">
            <Lock size={28} className="text-indigo-600" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unlock AI Resume Analysis</h2>
          <p className="text-gray-500 text-sm">Get expert-level feedback powered by AI to make your resume stand out.</p>
        </div>

        <ul className="text-left space-y-3">
          {[
            'Rewritten bullet points with action verbs & metrics',
            '3 missing ATS keywords identified for your target role',
            'Detailed overall feedback from AI reviewer',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
              <Sparkles size={15} className="text-indigo-500 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-gray-900">$4.99</span>
            <span className="text-gray-500 text-sm">one-time</span>
          </div>
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            onClick={handleUnlock}
            disabled={loading}
          >
            {loading ? 'Redirecting to checkout…' : 'Unlock Now'}
          </Button>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <p className="text-xs text-gray-400">Secure payment via Stripe · No subscription</p>
        </div>
      </div>
    </div>
  )
}
