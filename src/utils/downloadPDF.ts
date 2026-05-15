import { pdf, DocumentProps } from '@react-pdf/renderer'
import { createElement, ReactElement } from 'react'
import { ResumeData, TemplateId } from '@/types/resume'
import { ModernPDF } from '@/templates/pdf/ModernPDF'
import { MinimalPDF } from '@/templates/pdf/MinimalPDF'
import { ProfessionalPDF } from '@/templates/pdf/ProfessionalPDF'

const templateMap = {
  modern: ModernPDF,
  minimal: MinimalPDF,
  professional: ProfessionalPDF,
} as const

export async function downloadPDF(data: ResumeData, templateId: TemplateId, filename: string) {
  const Component = templateMap[templateId]
  const doc = createElement(Component, { data }) as ReactElement<DocumentProps>
  const blob = await pdf(doc).toBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.pdf`
  a.click()
  URL.revokeObjectURL(url)
}
