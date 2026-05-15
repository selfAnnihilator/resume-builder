'use client'

import { useState } from 'react'
import { useResumeStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Project } from '@/types/resume'
import { nanoid } from '@/lib/nanoid'

export function ProjectsSection() {
  const { resume, updateResume } = useResumeStore()
  const projects = resume.projects
  const [techInputs, setTechInputs] = useState<Record<string, string>>({})

  function add() {
    updateResume({ projects: [...projects, { id: nanoid(), name: '', description: '', tech: [], link: '', repo: '' }] })
  }

  function remove(id: string) {
    updateResume({ projects: projects.filter((p) => p.id !== id) })
  }

  function update(id: string, field: keyof Project, value: unknown) {
    updateResume({ projects: projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)) })
  }

  function addTech(id: string) {
    const val = (techInputs[id] ?? '').trim()
    if (!val) return
    const proj = projects.find((p) => p.id === id)
    if (!proj) return
    update(id, 'tech', [...proj.tech, val])
    setTechInputs((prev) => ({ ...prev, [id]: '' }))
  }

  function removeTech(projId: string, tech: string) {
    const proj = projects.find((p) => p.id === projId)
    if (!proj) return
    update(projId, 'tech', proj.tech.filter((t) => t !== tech))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Projects</h2>
      {projects.map((proj, idx) => (
        <div key={proj.id} className="rounded-md border p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">#{idx + 1}</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => remove(proj.id)}>
              Remove
            </Button>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Project Name</Label>
              <Input value={proj.name} onChange={(e) => update(proj.id, 'name', e.target.value)} placeholder="My Awesome Project" />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea value={proj.description} onChange={(e) => update(proj.id, 'description', e.target.value)} placeholder="Brief description of the project..." rows={2} />
            </div>
            <div className="space-y-1">
              <Label>Tech Stack</Label>
              <div className="flex flex-wrap gap-1 mb-1">
                {proj.tech.map((t) => (
                  <Badge key={t} variant="secondary" className="cursor-pointer" onClick={() => removeTech(proj.id, t)}>
                    {t} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={techInputs[proj.id] ?? ''}
                  onChange={(e) => setTechInputs((prev) => ({ ...prev, [proj.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && addTech(proj.id)}
                  placeholder="React, Node.js..."
                />
                <Button variant="outline" size="sm" onClick={() => addTech(proj.id)}>Add</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Live Link (optional)</Label>
                <Input value={proj.link ?? ''} onChange={(e) => update(proj.id, 'link', e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-1">
                <Label>Repo (optional)</Label>
                <Input value={proj.repo ?? ''} onChange={(e) => update(proj.id, 'repo', e.target.value)} placeholder="github.com/..." />
              </div>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add}>+ Add Project</Button>
    </div>
  )
}
