'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useResumeStore } from '@/lib/store'
import { ResumeData } from '@/types/resume'
import { AIFeedback } from '@/types/premium'
import { AIFeedbackPanel } from '@/components/optimize/AIFeedbackPanel'
import { ModernTemplate } from '@/templates/Modern'

type Phase =
  | { kind: 'checking' }
  | { kind: 'loading' }
  | { kind: 'done'; data: AIFeedback }
  | { kind: 'error'; message: string }

const TEMPLATE_PX = 793 // 210mm at 96dpi

function ScaledPreview({ data }: { data: ResumeData }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function update() {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      if (w > 0) setScale(w / TEMPLATE_PX)
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full overflow-x-hidden">
      <div style={{ zoom: scale }}>
        <ModernTemplate data={data} />
      </div>
    </div>
  )
}

function applyImprovements(resume: ResumeData, improvements: AIFeedback['bulletImprovements']): ResumeData {
  const map = new Map(improvements.map(i => [i.original, i.improved]))
  return {
    ...resume,
    experience: resume.experience.map(exp => ({
      ...exp,
      bullets: exp.bullets.map(b => map.get(b) ?? b),
    })),
  }
}

function OptimizeContent() {
  const router = useRouter()
  const resume = useResumeStore((s) => s.resume)
  const [phase, setPhase] = useState<Phase>({ kind: 'checking' })

  useEffect(() => {
    async function run() {
      const paymentId = localStorage.getItem('premium_payment_id')
      if (!paymentId) { router.replace('/analyze'); return }

      setPhase({ kind: 'loading' })

      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, resume }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setPhase({ kind: 'error', message: err.error || 'Analysis failed.' })
        return
      }

      const data: AIFeedback = await res.json()
      setPhase({ kind: 'done', data })
    }

    run().catch((e) => setPhase({ kind: 'error', message: e.message || 'Unexpected error.' }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const improvedResume = phase.kind === 'done'
    ? applyImprovements(resume, phase.data.bulletImprovements)
    : resume

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-6 py-3 border-b bg-white sticky top-0 z-10">
        <Link href="/analyze" className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors">
          ← Analyze
        </Link>
        <span className="font-bold text-indigo-700 text-sm">ResumeBuilder</span>
        <div className="w-16" />
      </nav>

      {phase.kind === 'checking' || phase.kind === 'loading' ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <p className="text-sm text-gray-500">
            {phase.kind === 'checking' ? 'Verifying access…' : 'Generating your recommendations…'}
          </p>
        </div>
      ) : phase.kind === 'done' ? (
        <div className="flex flex-col xl:flex-row gap-0 min-h-[calc(100vh-52px)]">
          {/* Left — Feedback panel */}
          <div className="flex-1 overflow-y-auto px-6 py-8 xl:max-w-[55%]">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Your Resume Recommendations</h1>
                <p className="text-sm text-gray-500 mt-1">Preview updates live on the right as you read</p>
              </div>
              <AIFeedbackPanel data={phase.data} />
            </div>
          </div>

          {/* Right — Live resume preview */}
          <div className="xl:w-[45%] xl:sticky xl:top-[52px] xl:self-start xl:h-[calc(100vh-52px)] border-l bg-gray-100">
            <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Preview — improvements applied</span>
              <Link
                href="/editor"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Edit in Editor →
              </Link>
            </div>
            <div className="overflow-auto h-[calc(100%-41px)]">
              <ScaledPreview data={improvedResume} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-lg font-bold text-gray-900">Analysis failed</h2>
          <p className="text-sm text-gray-500 max-w-sm">{phase.message}</p>
          <button
            onClick={() => setPhase({ kind: 'checking' })}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}

export default function OptimizePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    }>
      <OptimizeContent />
    </Suspense>
  )
}
