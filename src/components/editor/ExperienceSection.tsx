'use client'

import { useResumeStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Experience } from '@/types/resume'
import { nanoid } from '@/lib/nanoid'

export function ExperienceSection() {
  const { resume, updateResume } = useResumeStore()
  const experience = resume.experience

  function add() {
    updateResume({ experience: [...experience, { id: nanoid(), company: '', role: '', start: '', end: '', bullets: [''] }] })
  }

  function remove(id: string) {
    updateResume({ experience: experience.filter((e) => e.id !== id) })
  }

  function update(id: string, field: keyof Experience, value: unknown) {
    updateResume({ experience: experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)) })
  }

  function updateBullets(id: string, raw: string) {
    const bullets = raw.split('\n').map((b) => b.trimStart().replace(/^[-•]\s*/, ''))
    update(id, 'bullets', bullets)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Experience</h2>
      {experience.length === 0 && (
        <p className="text-sm text-muted-foreground">No experience added yet.</p>
      )}
      {experience.map((exp, idx) => (
        <div key={exp.id} className="rounded-md border p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">#{idx + 1}</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => remove(exp.id)}>
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Company</Label>
              <Input value={exp.company} onChange={(e) => update(exp.id, 'company', e.target.value)} placeholder="Acme Corp" />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Input value={exp.role} onChange={(e) => update(exp.id, 'role', e.target.value)} placeholder="Software Engineer Intern" />
            </div>
            <div className="space-y-1">
              <Label>Start</Label>
              <Input value={exp.start} onChange={(e) => update(exp.id, 'start', e.target.value)} placeholder="Jun 2023" />
            </div>
            <div className="space-y-1">
              <Label>End</Label>
              <Input value={exp.end} onChange={(e) => update(exp.id, 'end', e.target.value)} placeholder="Aug 2023 or Present" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Bullet Points (one per line)</Label>
            <Textarea
              value={exp.bullets.join('\n')}
              onChange={(e) => updateBullets(exp.id, e.target.value)}
              placeholder="Built X that improved Y by Z%&#10;Worked on..."
              rows={4}
            />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add}>+ Add Experience</Button>
    </div>
  )
}
