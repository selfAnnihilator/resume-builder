import { ResumeData } from '@/types/resume'
import { BulletSuggestion, ScoreResult, SectionScore } from '@/types/premium'

const ACTION_VERBS = new Set([
  'built', 'developed', 'designed', 'implemented', 'led', 'managed', 'created',
  'improved', 'increased', 'reduced', 'delivered', 'deployed', 'architected',
  'automated', 'optimized', 'collaborated', 'launched', 'maintained', 'integrated',
  'migrated', 'refactored', 'mentored', 'analyzed', 'researched', 'wrote',
  'tested', 'documented', 'engineered', 'streamlined', 'spearheaded', 'drove',
  'coordinated', 'established', 'transformed', 'accelerated', 'achieved',
])

const COMMON_TECH_KEYWORDS = [
  'REST API', 'GraphQL', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'GCP', 'Azure',
  'TypeScript', 'Python', 'Node.js', 'React', 'Next.js', 'PostgreSQL', 'MongoDB',
  'Redis', 'Linux', 'Agile', 'Scrum', 'Git', 'Terraform', 'Microservices',
  'System Design', 'Unit Testing', 'Data Structures', 'Algorithms', 'SQL',
  'Machine Learning', 'Data Analysis', 'Figma', 'Tailwind CSS', 'Jest',
]

function scoreCompleteness(data: ResumeData): SectionScore {
  const issues: string[] = []
  let score = 0

  if (data.personal.name.trim()) score += 5
  else issues.push('Full name is missing')

  if (data.personal.email.trim()) score += 5
  else issues.push('Email address is missing')

  if (data.personal.phone.trim()) score += 5
  else issues.push('Phone number is missing')

  if (data.summary.trim()) score += 5
  else issues.push('Professional summary is missing')

  if (data.education.some(e => e.institution.trim())) score += 5
  else issues.push('Education section is empty')

  return { score, max: 25, issues }
}

function scoreContent(data: ResumeData): SectionScore {
  const issues: string[] = []
  let score = 0

  if (data.summary.trim().length >= 50) score += 8
  else if (data.summary.trim().length > 0) issues.push('Summary is too short (under 50 characters)')

  const allBullets = data.experience.flatMap(e => e.bullets.filter(Boolean))
  if (allBullets.length > 0) {
    const verbCount = allBullets.filter(b => {
      const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
      return ACTION_VERBS.has(firstWord)
    }).length
    if (verbCount / allBullets.length > 0.5) score += 8
    else issues.push('Experience bullets should start with action verbs (Built, Developed, Led, etc.)')

    const hasMetrics = allBullets.some(b => /\d+/.test(b))
    if (hasMetrics) score += 7
    else issues.push('Add quantifiable metrics to experience bullets (%, numbers, scale)')
  } else {
    issues.push('Add work experience with bullet points')
  }

  if (data.projects.length > 0) {
    const allHaveDesc = data.projects.filter(p => p.name).every(p => p.description.trim().length > 10)
    if (allHaveDesc) score += 7
    else issues.push('Some projects are missing descriptions')
  }

  return { score, max: 30, issues }
}

function scoreSkills(data: ResumeData): SectionScore {
  const issues: string[] = []
  let score = 0

  const filledGroups = data.skills.filter(g => g.items.length > 0)
  const totalItems = filledGroups.reduce((sum, g) => sum + g.items.length, 0)

  if (filledGroups.length > 0) score += 7
  else issues.push('No skills listed')

  if (totalItems >= 5) score += 7
  else issues.push('Add at least 5 skills for better ATS matching')

  if (filledGroups.length >= 2) score += 6
  else if (filledGroups.length > 0) issues.push('Organize skills into multiple categories (Languages, Frameworks, Tools, etc.)')

  return { score, max: 20, issues }
}

function scoreATS(data: ResumeData): SectionScore {
  const issues: string[] = []
  let score = 0

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal.email.trim())
  if (emailValid) score += 7
  else issues.push('Email format appears invalid')

  if (data.personal.linkedin.trim()) score += 6
  else issues.push('LinkedIn profile URL is missing — critical for ATS')

  if (data.personal.github.trim()) score += 6
  else issues.push('GitHub profile URL is missing — add for tech roles')

  const contactComplete = data.personal.name.trim() && data.personal.email.trim() && data.personal.phone.trim()
  if (contactComplete) score += 6
  else issues.push('Complete contact section: name, email, and phone should all be filled')

  return { score, max: 25, issues }
}

function getBulletSuggestions(data: ResumeData): BulletSuggestion[] {
  const suggestions: BulletSuggestion[] = []
  const allBullets = data.experience.flatMap(e => e.bullets.filter(Boolean))

  for (const bullet of allBullets.slice(0, 10)) {
    const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
    const hasVerb = ACTION_VERBS.has(firstWord)
    const hasMetric = /\d+/.test(bullet)

    if (!hasVerb && !hasMetric) {
      suggestions.push({ original: bullet, tip: 'Start with an action verb and add a metric (e.g. "Built X, reducing Y by 30%")' })
    } else if (!hasVerb) {
      suggestions.push({ original: bullet, tip: 'Start with a strong action verb (e.g. Built, Developed, Implemented, Led)' })
    } else if (!hasMetric) {
      suggestions.push({ original: bullet, tip: 'Add a quantifiable result (%, time saved, users impacted, etc.)' })
    }
  }

  return suggestions.slice(0, 5)
}

function getSuggestedKeywords(data: ResumeData): string[] {
  const allText = [
    ...data.skills.flatMap(g => g.items),
    ...data.experience.flatMap(e => e.bullets),
    ...data.projects.map(p => p.description + ' ' + p.tech.join(' ')),
  ].join(' ').toLowerCase()

  return COMMON_TECH_KEYWORDS.filter(kw => {
    return !allText.includes(kw.toLowerCase())
  }).slice(0, 5)
}

export function analyzeResume(data: ResumeData): ScoreResult {
  const completeness = scoreCompleteness(data)
  const content = scoreContent(data)
  const skills = scoreSkills(data)
  const ats = scoreATS(data)

  const total = completeness.score + content.score + skills.score + ats.score

  const label: ScoreResult['label'] =
    total >= 80 ? 'Strong' :
    total >= 60 ? 'Good' :
    total >= 40 ? 'Fair' : 'Weak'

  return {
    total,
    label,
    sections: { completeness, content, skills, ats },
    bulletSuggestions: getBulletSuggestions(data),
    suggestedKeywords: getSuggestedKeywords(data),
  }
}
