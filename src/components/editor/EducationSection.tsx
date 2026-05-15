'use client'

import { useResumeStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Education } from '@/types/resume'
import { nanoid } from '@/lib/nanoid'

export function EducationSection() {
  const { resume, updateResume } = useResumeStore()
  const education = resume.education

  function add() {
    updateResume({
      education: [
        ...education,
        { id: nanoid(), institution: '', degree: '', field: '', start: '', end: '', gpa: '' },
      ],
    })
  }

  function remove(id: string) {
    updateResume({ education: education.filter((e) => e.id !== id) })
  }

  function update(id: string, field: keyof Education, value: string) {
    updateResume({
      education: education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Education</h2>
      {education.map((edu, idx) => (
        <div key={edu.id} className="rounded-md border p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">#{idx + 1}</span>
            {education.length > 1 && (
              <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => remove(edu.id)}>
                Remove
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <Label>Institution</Label>
              <Input value={edu.institution} onChange={(e) => update(edu.id, 'institution', e.target.value)} placeholder="State University" />
            </div>
            <div className="space-y-1">
              <Label>Degree</Label>
              <Input value={edu.degree} onChange={(e) => update(edu.id, 'degree', e.target.value)} placeholder="B.Tech" />
            </div>
            <div className="space-y-1">
              <Label>Field</Label>
              <Input value={edu.field} onChange={(e) => update(edu.id, 'field', e.target.value)} placeholder="Computer Science" />
            </div>
            <div className="space-y-1">
              <Label>Start</Label>
              <Input value={edu.start} onChange={(e) => update(edu.id, 'start', e.target.value)} placeholder="Aug 2020" />
            </div>
            <div className="space-y-1">
              <Label>End</Label>
              <Input value={edu.end} onChange={(e) => update(edu.id, 'end', e.target.value)} placeholder="May 2024" />
            </div>
            <div className="space-y-1">
              <Label>GPA (optional)</Label>
              <Input value={edu.gpa ?? ''} onChange={(e) => update(edu.id, 'gpa', e.target.value)} placeholder="8.5/10" />
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add}>+ Add Education</Button>
    </div>
  )
}
