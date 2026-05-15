'use client'

import { useResumeStore } from '@/lib/store'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function AchievementsSection() {
  const { resume, updateResume } = useResumeStore()
  const achievements = resume.achievements

  function handleChange(raw: string) {
    const items = raw.split('\n').map((a) => a.trimStart().replace(/^[-•]\s*/, ''))
    updateResume({ achievements: items })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Achievements</h2>
      <div className="space-y-1">
        <Label>Achievements (one per line)</Label>
        <Textarea
          value={achievements.join('\n')}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Ranked top 5% in national coding competition&#10;Won hackathon at XYZ"
          rows={5}
        />
      </div>
    </div>
  )
}
