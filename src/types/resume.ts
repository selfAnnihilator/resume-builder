export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  website: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  start: string
  end: string
  gpa?: string
}

export interface SkillGroup {
  id: string
  category: string
  items: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  tech: string[]
  link?: string
  repo?: string
}

export interface Experience {
  id: string
  company: string
  role: string
  start: string
  end: string
  bullets: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  link?: string
}

export interface ResumeData {
  personal: PersonalInfo
  summary: string
  education: Education[]
  skills: SkillGroup[]
  projects: Project[]
  experience: Experience[]
  certifications: Certification[]
  achievements: string[]
}

export type TemplateId = 'modern' | 'minimal' | 'professional'
