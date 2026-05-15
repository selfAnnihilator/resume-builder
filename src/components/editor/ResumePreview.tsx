'use client'

import { useResumeStore } from '@/lib/store'
import { ModernTemplate } from '@/templates/Modern'
import { MinimalTemplate } from '@/templates/Minimal'
import { ProfessionalTemplate } from '@/templates/Professional'

export function ResumePreview() {
  const { resume, activeTemplate } = useResumeStore()

  return (
    <>
      {activeTemplate === 'modern' && <ModernTemplate data={resume} />}
      {activeTemplate === 'minimal' && <MinimalTemplate data={resume} />}
      {activeTemplate === 'professional' && <ProfessionalTemplate data={resume} />}
    </>
  )
}
