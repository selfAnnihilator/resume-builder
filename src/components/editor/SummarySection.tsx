'use client'

import { useState } from 'react'
import { useResumeStore } from '@/lib/store'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

function extractGithubUsername(value: string): string | null {
  const trimmed = value.trim()
  const match = trimmed.match(/github\.com\/([^/\s]+)/)
  if (match) return match[1]
  if (/^[a-zA-Z0-9-]+$/.test(trimmed)) return trimmed
  return null
}

const OPENERS = [
  'Passionate and driven',
  'Motivated and detail-oriented',
  'Enthusiastic and results-driven',
  'Dedicated and adaptable',
  'Curious and hardworking',
  'Ambitious and collaborative',
]

const MIDDLES = [
  'developer with hands-on experience in',
  'engineer with a strong foundation in',
  'technologist proficient in',
  'professional with expertise in',
  'graduate skilled in',
]

const CLOSERS = [
  'Eager to contribute to impactful projects and grow within a dynamic team.',
  'Looking to apply technical skills to solve real-world problems in a collaborative environment.',
  'Committed to writing clean, maintainable code and continuously learning new technologies.',
  'Excited to bring strong problem-solving skills and a growth mindset to a forward-thinking organization.',
  'Passionate about building reliable software and collaborating with cross-functional teams.',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateSummary(allSkills: string[], name: string): string {
  const opener = pick(OPENERS)
  const middle = pick(MIDDLES)
  const closer = pick(CLOSERS)

  const skillList = allSkills.length > 0
    ? allSkills.slice(0, 6).join(', ')
    : 'various technologies'

  const namePart = name ? `${name} is a` : 'A'
  return `${namePart} ${opener.toLowerCase()} ${middle} ${skillList}. ${closer}`
}

export function SummarySection() {
  const { resume, updateResume } = useResumeStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleGenerate() {
    const allSkills = resume.skills.flatMap((g) => g.items).filter(Boolean)
    if (allSkills.length === 0) {
      setError('Add some skills first to generate a summary.')
      return
    }
    setError('')
    const generated = generateSummary(allSkills, resume.personal.name)
    updateResume({ summary: generated })
  }

  async function handleAutoFill() {
    const username = extractGithubUsername(resume.personal.github)
    if (!username) {
      setError('Add a GitHub username or URL in Personal Info first.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`https://api.github.com/users/${username}`)
      if (!res.ok) throw new Error('GitHub user not found.')
      const gh = await res.json()
      if (gh.bio) {
        updateResume({ summary: gh.bio })
      } else {
        setError('No bio found on this GitHub profile.')
      }
      if (!resume.personal.name && gh.name) {
        updateResume({ personal: { ...resume.personal, name: gh.name } })
      }
      if (!resume.personal.location && gh.location) {
        updateResume({ personal: { ...resume.personal, location: gh.location } })
      }
      if (!resume.personal.website && gh.blog) {
        updateResume({ personal: { ...resume.personal, website: gh.blog } })
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fetch GitHub profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">Summary</h2>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={handleGenerate}
          >
            Generate from Skills
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={handleAutoFill}
            disabled={loading}
          >
            {loading ? 'Fetching…' : 'From GitHub'}
          </Button>
        </div>
      </div>
      <Textarea
        placeholder="A short professional summary about yourself…"
        className="text-sm resize-none min-h-[80px]"
        value={resume.summary}
        onChange={(e) => updateResume({ summary: e.target.value })}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
