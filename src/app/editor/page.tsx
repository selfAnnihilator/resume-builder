'use client'

import { useState } from 'react'
import { useResumeStore } from '@/lib/store'
import { PersonalSection } from '@/components/editor/PersonalSection'
import { SummarySection } from '@/components/editor/SummarySection'
import { EducationSection } from '@/components/editor/EducationSection'
import { SkillsSection } from '@/components/editor/SkillsSection'
import { ProjectsSection } from '@/components/editor/ProjectsSection'
import { ExperienceSection } from '@/components/editor/ExperienceSection'
import { CertificationsSection } from '@/components/editor/CertificationsSection'
import { AchievementsSection } from '@/components/editor/AchievementsSection'
import { TemplateSwitcher } from '@/components/editor/TemplateSwitcher'
import { ResumePreview } from '@/components/editor/ResumePreview'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export default function EditorPage() {
  const { resume, activeTemplate, resetResume } = useResumeStore()
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    try {
      const { downloadPDF } = await import('@/utils/downloadPDF')
      await downloadPDF(resume, activeTemplate, resume.personal.name || 'resume')
    } finally {
      setDownloading(false)
    }
  }

  function handleReset() {
    if (window.confirm('Reset all resume data? This cannot be undone.')) {
      resetResume()
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 md:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white md:hidden">
        <Link href="/" className="text-sm font-bold text-indigo-700">← Home</Link>
        <div className="flex gap-1 rounded-lg border p-0.5 bg-gray-100">
          <button
            onClick={() => setTab('edit')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${tab === 'edit' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setTab('preview')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${tab === 'preview' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
          >
            Preview
          </button>
        </div>
        <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 h-8" disabled={downloading} onClick={handleDownload}>
          {downloading ? '…' : 'PDF'}
        </Button>
      </div>

      {/* Left — Editor panel */}
      <div className={`md:w-[420px] md:shrink-0 flex flex-col border-r bg-white md:flex ${tab === 'preview' ? 'hidden' : 'flex'} flex-1 md:flex-none`}>
        <div className="hidden md:flex items-center justify-between px-4 py-3 border-b">
          <Link href="/" className="text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors">← ResumeBuilder</Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700" disabled={downloading} onClick={handleDownload}>
              {downloading ? 'Generating…' : 'Download PDF'}
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          <PersonalSection />
          <Separator />
          <SummarySection />
          <Separator />
          <EducationSection />
          <Separator />
          <SkillsSection />
          <Separator />
          <ExperienceSection />
          <Separator />
          <ProjectsSection />
          <Separator />
          <CertificationsSection />
          <Separator />
          <AchievementsSection />
        </div>
      </div>

      {/* Right — Preview panel */}
      <div className={`flex-1 flex flex-col overflow-hidden md:flex ${tab === 'edit' ? 'hidden' : 'flex'}`}>
        <div className="hidden md:flex items-center justify-between px-4 py-3 border-b bg-white">
          <span className="text-sm text-muted-foreground">Preview</span>
          <TemplateSwitcher />
        </div>
        {/* Mobile template switcher */}
        <div className="flex md:hidden items-center justify-between px-4 py-2 border-b bg-white">
          <TemplateSwitcher />
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-6 flex justify-center">
          <div className="shadow-lg origin-top-left scale-[0.45] md:scale-75 lg:scale-90 xl:scale-100">
            <div className="resume-preview-root">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
