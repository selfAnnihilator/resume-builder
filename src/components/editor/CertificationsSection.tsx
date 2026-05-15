'use client'

import { useResumeStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Certification } from '@/types/resume'
import { nanoid } from '@/lib/nanoid'

export function CertificationsSection() {
  const { resume, updateResume } = useResumeStore()
  const certifications = resume.certifications

  function add() {
    updateResume({ certifications: [...certifications, { id: nanoid(), name: '', issuer: '', date: '', link: '' }] })
  }

  function remove(id: string) {
    updateResume({ certifications: certifications.filter((c) => c.id !== id) })
  }

  function update(id: string, field: keyof Certification, value: string) {
    updateResume({ certifications: certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)) })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Certifications</h2>
      {certifications.length === 0 && (
        <p className="text-sm text-muted-foreground">No certifications added yet.</p>
      )}
      {certifications.map((cert, idx) => (
        <div key={cert.id} className="rounded-md border p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">#{idx + 1}</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => remove(cert.id)}>
              Remove
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <Label>Certificate Name</Label>
              <Input value={cert.name} onChange={(e) => update(cert.id, 'name', e.target.value)} placeholder="AWS Certified Developer" />
            </div>
            <div className="space-y-1">
              <Label>Issuer</Label>
              <Input value={cert.issuer} onChange={(e) => update(cert.id, 'issuer', e.target.value)} placeholder="Amazon" />
            </div>
            <div className="space-y-1">
              <Label>Date</Label>
              <Input value={cert.date} onChange={(e) => update(cert.id, 'date', e.target.value)} placeholder="Mar 2024" />
            </div>
            <div className="col-span-2 space-y-1">
              <Label>Link (optional)</Label>
              <Input value={cert.link ?? ''} onChange={(e) => update(cert.id, 'link', e.target.value)} placeholder="https://..." />
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add}>+ Add Certification</Button>
    </div>
  )
}
