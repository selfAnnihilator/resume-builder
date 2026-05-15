'use client'

import { useResumeStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PersonalInfo } from '@/types/resume'

export function PersonalSection() {
  const { resume, updateResume } = useResumeStore()
  const personal = resume.personal

  function update(field: keyof PersonalInfo, value: string) {
    updateResume({ personal: { ...personal, [field]: value } })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Personal Info</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={personal.name} onChange={(e) => update('name', e.target.value)} placeholder="Jane Doe" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={personal.email} onChange={(e) => update('email', e.target.value)} placeholder="jane@example.com" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={personal.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+1 234 567 8900" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="location">Location</Label>
          <Input id="location" value={personal.location} onChange={(e) => update('location', e.target.value)} placeholder="New York, NY" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" value={personal.linkedin} onChange={(e) => update('linkedin', e.target.value)} placeholder="linkedin.com/in/jane" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="github">GitHub</Label>
          <Input id="github" value={personal.github} onChange={(e) => update('github', e.target.value)} placeholder="github.com/jane" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="website">Website</Label>
          <Input id="website" value={personal.website} onChange={(e) => update('website', e.target.value)} placeholder="jane.dev" />
        </div>
      </div>
    </div>
  )
}
