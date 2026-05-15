'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Sparkles } from 'lucide-react'
import { useResumeStore } from '@/lib/store'
import { analyzeResume } from '@/lib/scoring'
import { ScoreResult } from '@/types/premium'
import { ScoreRing } from '@/components/analyze/ScoreRing'
import { IssueList } from '@/components/analyze/IssueList'
import { SuggestionsPanel } from '@/components/analyze/SuggestionsPanel'
import { UploadResumeButton } from '@/components/UploadResumeButton'

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayOptions {
  key: string
  amount: number | string
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill?: { email?: string }
  theme?: { color?: string }
  modal?: { ondismiss?: () => void }
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void }
  }
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.Razorpay) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.head.appendChild(script)
  })
}

export default function AnalyzePage() {
  const resume = useResumeStore((s) => s.resume)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [unlocking, setUnlocking] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)

  async function handleUnlock() {
    setUnlocking(true)
    setPayError(null)
    try {
      await loadRazorpayScript()

      const orderRes = await fetch('/api/checkout', { method: 'POST' })
      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}))
        throw new Error(err.error || 'Could not create order')
      }
      const { orderId, amount, currency, keyId } = await orderRes.json()

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: 'ResumeBuilder',
        description: 'Premium Resume Recommendations',
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          })
          if (verifyRes.ok) {
            const { paymentId } = await verifyRes.json()
            localStorage.setItem('premium_payment_id', paymentId)
            router.push('/optimize')
          } else {
            setPayError('Payment verification failed. Please contact support.')
            setUnlocking(false)
          }
        },
        prefill: { email: resume.personal.email || '' },
        theme: { color: '#4F46E5' },
        modal: { ondismiss: () => setUnlocking(false) },
      })
      rzp.open()
    } catch (e) {
      setPayError(e instanceof Error ? e.message : 'Payment failed. Please try again.')
      setUnlocking(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    setResult(analyzeResume(resume))
  }, [resume])

  if (!mounted || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">Analyzing resume…</div>
      </div>
    )
  }

  if (!resume.personal.name.trim() && !resume.personal.email.trim()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="text-4xl mb-4">📄</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">No resume data found</h1>
        <p className="text-gray-500 text-sm mb-6">Build your resume first, or upload a PDF/DOCX to check your score.</p>
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/editor"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Go to Editor →
          </Link>
          <UploadResumeButton
            label="Upload Resume"
            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-6 py-3 border-b bg-white sticky top-0 z-10">
        <Link href="/editor" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
          ← Editor
        </Link>
        <span className="font-bold text-indigo-700 text-sm">ResumeBuilder</span>
        <div className="w-16" />
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">ATS Resume Score</h1>
          <p className="text-sm text-gray-500 mt-1">Based on completeness, content quality, skills, and ATS compatibility</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-[40%] flex flex-col items-center">
            <div className="bg-white rounded-2xl border p-8 w-full flex flex-col items-center">
              <ScoreRing score={result.total} label={result.label} />
            </div>
          </div>
          <div className="flex-1">
            <IssueList sections={result.sections} />
          </div>
        </div>

        {/* Blurred recommendations paywall */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="blur-sm select-none pointer-events-none">
            <SuggestionsPanel
              bulletSuggestions={result.bulletSuggestions}
              suggestedKeywords={result.suggestedKeywords}
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] gap-3 px-4 text-center">
            <div className="bg-indigo-600 rounded-full p-3">
              <Lock size={20} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Unlock Full Recommendations</p>
              <p className="text-sm text-gray-500 mt-0.5">Bullet rewrites, missing keywords & detailed feedback</p>
            </div>
            <button
              onClick={handleUnlock}
              disabled={unlocking}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              <Sparkles size={14} />
              {unlocking ? 'Opening payment…' : 'Unlock Now — ₹199'}
            </button>
            {payError && <p className="text-xs text-red-500 max-w-xs">{payError}</p>}
            <p className="text-xs text-gray-400">One-time · No subscription</p>
          </div>
        </div>
      </div>
    </div>
  )
}
