'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2 } from 'lucide-react'
import { useResumeStore } from '@/lib/store'
import { ResumeData } from '@/types/resume'

interface Props {
  className?: string
  label?: string
}

export function UploadResumeButton({ className, label = 'Upload Resume' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const setResume = useResumeStore((s) => s.setResume)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setLoading(true)
    e.target.value = ''

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/parse-resume', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to parse resume.')
        return
      }

      setResume(data as ResumeData)
      router.push('/analyze')
    } catch {
      setError('Unexpected error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.doc"
        className="hidden"
        onChange={handleFile}
      />
      <button
        onClick={() => !loading && inputRef.current?.click()}
        disabled={loading}
        className={className}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
        {loading ? 'Parsing resume…' : label}
      </button>
      {error && <p className="text-xs text-red-500 mt-1 max-w-xs text-center">{error}</p>}
    </div>
  )
}
