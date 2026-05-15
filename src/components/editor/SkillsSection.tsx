'use client'

import { useState } from 'react'
import { useResumeStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SkillGroup } from '@/types/resume'
import { nanoid } from '@/lib/nanoid'

export function SkillsSection() {
  const { resume, updateResume } = useResumeStore()
  const skills = resume.skills
  const [inputs, setInputs] = useState<Record<string, string>>({})

  function addGroup() {
    updateResume({ skills: [...skills, { id: nanoid(), category: '', items: [] }] })
  }

  function removeGroup(id: string) {
    updateResume({ skills: skills.filter((s) => s.id !== id) })
  }

  function updateGroup(id: string, field: keyof SkillGroup, value: unknown) {
    updateResume({ skills: skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)) })
  }

  function addItem(id: string) {
    const val = (inputs[id] ?? '').trim()
    if (!val) return
    const group = skills.find((s) => s.id === id)
    if (!group) return
    updateGroup(id, 'items', [...group.items, val])
    setInputs((p) => ({ ...p, [id]: '' }))
  }

  function removeItem(groupId: string, item: string) {
    const group = skills.find((s) => s.id === groupId)
    if (!group) return
    updateGroup(groupId, 'items', group.items.filter((i) => i !== item))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Skills</h2>
      {skills.map((group, idx) => (
        <div key={group.id} className="rounded-md border p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">#{idx + 1}</span>
            {skills.length > 1 && (
              <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => removeGroup(group.id)}>
                Remove
              </Button>
            )}
          </div>
          <div className="space-y-1">
            <Label>Category</Label>
            <Input value={group.category} onChange={(e) => updateGroup(group.id, 'category', e.target.value)} placeholder="Languages" />
          </div>
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-1">
              {group.items.map((item) => (
                <Badge key={item} variant="secondary" className="cursor-pointer" onClick={() => removeItem(group.id, item)}>
                  {item} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={inputs[group.id] ?? ''}
                onChange={(e) => setInputs((p) => ({ ...p, [group.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && addItem(group.id)}
                placeholder="Type skill, press Enter"
              />
              <Button variant="outline" size="sm" onClick={() => addItem(group.id)}>Add</Button>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addGroup}>+ Add Category</Button>
    </div>
  )
}
