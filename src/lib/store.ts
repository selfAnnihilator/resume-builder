import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ResumeData, TemplateId } from '@/types/resume'
import { defaultResume } from './defaultResume'

interface ResumeStore {
  resume: ResumeData
  activeTemplate: TemplateId
  setResume: (resume: ResumeData) => void
  updateResume: (partial: Partial<ResumeData>) => void
  setActiveTemplate: (id: TemplateId) => void
  resetResume: () => void
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: defaultResume,
      activeTemplate: 'modern',
      setResume: (resume) => set({ resume }),
      updateResume: (partial) =>
        set((state) => ({ resume: { ...state.resume, ...partial } })),
      setActiveTemplate: (id) => set({ activeTemplate: id }),
      resetResume: () => set({ resume: defaultResume }),
    }),
    {
      name: 'resume-builder-data',
    }
  )
)
