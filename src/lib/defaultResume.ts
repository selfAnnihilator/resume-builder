import { ResumeData } from '@/types/resume'
import { nanoid } from './nanoid'

export const defaultResume: ResumeData = {
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
  },
  summary: '',
  education: [
    {
      id: nanoid(),
      institution: '',
      degree: '',
      field: '',
      start: '',
      end: '',
      gpa: '',
    },
  ],
  skills: [
    {
      id: nanoid(),
      category: 'Languages',
      items: [],
    },
  ],
  projects: [],
  experience: [],
  certifications: [],
  achievements: [],
}
