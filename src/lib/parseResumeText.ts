import { randomUUID } from 'crypto'
import { ResumeData, Education, SkillGroup, Project, Experience, Certification } from '@/types/resume'

const EMAIL_RE = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/
const PHONE_RE = /(?:\+?[\d][\d\s\-().]{7,14}\d)/
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+\/?/i
const GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+\/?/i

const DATE_RANGE_RE = /(\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+)?\d{4}\s*[-–—]\s*(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+)?\d{4}|(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+)?\d{4}\s*[-–—]\s*(?:Present|Current|Now)/i

const SECTION_MAP: Array<[string, RegExp]> = [
  ['experience', /^(?:WORK\s+)?EXPERIENCE$|^PROFESSIONAL\s+EXPERIENCE$|^EMPLOYMENT(?:\s+HISTORY)?$|^WORK\s+HISTORY$/i],
  ['education', /^EDUCATION(?:AL\s+BACKGROUND)?$|^ACADEMICS?$|^ACADEMIC\s+BACKGROUND$|^QUALIFICATIONS?$/i],
  ['skills', /^(?:TECHNICAL\s+)?SKILLS?(?:\s+[&\/]\s*(?:TECHNOLOGIES|EXPERTISE))?$|^TECHNOLOGIES$|^CORE\s+COMPETENCIES$|^TECHNICAL\s+EXPERTISE$|^TOOLS?\s+(?:&\s*)?TECHNOLOGIES$/i],
  ['projects', /^(?:PERSONAL\s+|ACADEMIC\s+|KEY\s+|SIDE\s+)?PROJECTS?$/i],
  ['summary', /^(?:PROFESSIONAL\s+)?SUMMARY$|^OBJECTIVE$|^PROFILE$|^ABOUT(?:\s+ME)?$|^CAREER\s+OBJECTIVE$|^EXECUTIVE\s+SUMMARY$/i],
  ['certifications', /^CERTIFICATIONS?$|^CERTIFICATES?$|^LICENSES?\s+(?:&|AND)\s+CERTIFICATIONS?$|^CREDENTIALS?$/i],
  ['achievements', /^ACHIEVEMENTS?$|^AWARDS?(?:\s+(?:&|AND)\s+HONORS?)?$|^HONORS?$|^ACCOMPLISHMENTS?$|^RECOGNITION$/i],
]

function detectSection(line: string): string | null {
  const trimmed = line.trim().replace(/:$/, '').trim()
  for (const [key, pattern] of SECTION_MAP) {
    if (pattern.test(trimmed)) return key
  }
  return null
}

function splitIntoSections(text: string): Record<string, string[]> {
  const sections: Record<string, string[]> = {
    header: [], summary: [], experience: [], education: [],
    skills: [], projects: [], certifications: [], achievements: [],
  }
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  let current = 'header'

  for (const line of lines) {
    if (/^[-=_*]{3,}$/.test(line)) continue
    const detected = detectSection(line)
    if (detected) {
      current = detected
      continue
    }
    sections[current].push(line)
  }

  return sections
}

function extractName(headerLines: string[]): string {
  for (const line of headerLines) {
    if (
      !EMAIL_RE.test(line) &&
      !LINKEDIN_RE.test(line) &&
      !GITHUB_RE.test(line) &&
      !/^\d/.test(line) &&
      !/https?:\/\//.test(line) &&
      line.trim().length > 1
    ) {
      return line.trim()
    }
  }
  return ''
}

function extractLocation(text: string): string {
  const match = text.match(/\b([A-Z][a-zA-Z\s]+),\s*([A-Z]{2}|[A-Z][a-zA-Z]+)\b/)
  return match?.[0] || ''
}

function extractWebsite(text: string, linkedin: string, github: string): string {
  const urls = text.match(/https?:\/\/[^\s,;()<>]+/g) || []
  for (const url of urls) {
    if (!url.includes('linkedin.com') && !url.includes('github.com') && url !== linkedin && url !== github) {
      return url
    }
  }
  return ''
}

function isBulletLine(line: string): boolean {
  return /^[•\-*–·]\s+/.test(line) || /^\d+[.)]\s+/.test(line)
}

function stripBullet(line: string): string {
  return line.replace(/^[•\-*–·]\s+/, '').replace(/^\d+[.)]\s+/, '').trim()
}

function parseExperience(lines: string[]): Experience[] {
  if (!lines.length) return []
  const experiences: Experience[] = []

  interface EntryBuf { headerLines: string[]; bullets: string[] }
  let current: EntryBuf | null = null

  function flush() {
    if (!current) return
    const e = buildExperience(current.headerLines, current.bullets)
    if (e.company || e.role || e.bullets.length) experiences.push(e)
    current = null
  }

  for (const line of lines) {
    const bullet = isBulletLine(line)
    const hasDate = DATE_RANGE_RE.test(line)

    if (!bullet && hasDate) {
      if (!current) current = { headerLines: [], bullets: [] }
      current.headerLines.push(line)
    } else if (bullet) {
      if (!current) current = { headerLines: [], bullets: [] }
      current.bullets.push(stripBullet(line))
    } else {
      // Non-bullet, non-date text line
      if (current?.bullets.length) {
        flush()
        current = { headerLines: [line], bullets: [] }
      } else {
        if (!current) current = { headerLines: [], bullets: [] }
        current.headerLines.push(line)
      }
    }
  }
  flush()

  return experiences
}

function buildExperience(headerLines: string[], bullets: string[]): Experience {
  let company = ''
  let role = ''
  let start = ''
  let end = ''

  for (const line of headerLines) {
    const dateRange = line.match(/(\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+)?\d{4}\s*[-–—]\s*(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+)?\d{4}|\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{4}\s*[-–—]\s*(?:Present|Current|Now)/i)
    if (dateRange) {
      const [s, e2] = dateRange[0].split(/\s*[-–—]\s*/)
      start = s?.trim() || ''
      end = e2?.trim() || ''
      const stripped = line.replace(dateRange[0], '').replace(/[|,·]/g, '').trim()
      if (stripped && !company) company = stripped
    } else if (!company) {
      company = line.replace(/[|,·]/g, '').trim()
    } else if (!role) {
      role = line.replace(/[|,·]/g, '').trim()
    }
  }

  return { id: randomUUID().slice(0, 8), company, role, start, end, bullets }
}

function parseEducation(lines: string[]): Education[] {
  if (!lines.length) return []

  const DEGREE_RE = /\b(?:Bachelor|B\.?[STEAs]\.?|Master|M\.?[STEsA]\.?|PhD|Ph\.D\.?|Doctor|Associate|Diploma|B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?|B\.?Sc\.?|M\.?Sc\.?|MBA)\b/i
  const GPA_RE = /(?:GPA|CGPA|G\.P\.A\.?)[:\s]+(\d+\.?\d*)/i

  const educations: Education[] = []
  interface EduBuf { institution: string; degree: string; field: string; start: string; end: string; gpa?: string }
  let current: EduBuf | null = null

  function flush() {
    if (current?.institution) {
      educations.push({ id: randomUUID().slice(0, 8), ...current })
    }
    current = null
  }

  for (const line of lines) {
    if (isBulletLine(line)) continue

    const hasDate = DATE_RANGE_RE.test(line)
    const hasDegree = DEGREE_RE.test(line)
    const gpaMatch = line.match(GPA_RE)

    if (!current) {
      current = { institution: line, degree: '', field: '', start: '', end: '' }
      continue
    }

    if (gpaMatch) {
      current.gpa = gpaMatch[1]
    } else if (hasDate) {
      const range = line.match(/(\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+)?\d{4}\s*[-–—]\s*(?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+)?\d{4}|\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{4}\s*[-–—]\s*(?:Present|Current|Now)/i)
      if (range) {
        const [s, e2] = range[0].split(/\s*[-–—]\s*/)
        current.start = s?.trim() || ''
        current.end = e2?.trim() || ''
      }
    } else if (hasDegree && !current.degree) {
      const degreeMatch = line.match(/^((?:Bachelor|Master|PhD|Ph\.D\.?|Doctor|Associate|Diploma|B\.?Tech|M\.?Tech|B\.?[STEAs]\.?|M\.?[STEsA]\.?|B\.?E\.?|M\.?E\.?|B\.?Sc\.?|M\.?Sc\.?|MBA)[^,;\n]*?)(?:\s+(?:in|of)\s+(.+))?$/i)
      if (degreeMatch) {
        current.degree = degreeMatch[1]?.trim() || line
        current.field = degreeMatch[2]?.trim() || ''
      } else {
        current.degree = line
      }
    } else if (current.end || current.start) {
      // Completed an entry, start new
      flush()
      current = { institution: line, degree: '', field: '', start: '', end: '' }
    }
  }
  flush()

  return educations
}

function parseSkills(lines: string[]): SkillGroup[] {
  if (!lines.length) return []
  const groups: SkillGroup[] = []

  for (const line of lines) {
    if (isBulletLine(line)) {
      // treat bullet items as general skills
      const item = stripBullet(line)
      if (item) {
        const last = groups[groups.length - 1]
        if (last && last.category === 'Skills') last.items.push(item)
        else groups.push({ id: randomUUID().slice(0, 8), category: 'Skills', items: [item] })
      }
      continue
    }

    const colonIdx = line.indexOf(':')
    if (colonIdx > 0 && colonIdx < 40) {
      const category = line.slice(0, colonIdx).trim()
      const rest = line.slice(colonIdx + 1).trim()
      const items = rest.split(/[,|•·\/]/g).map(s => s.trim()).filter(s => s.length > 0 && s.length < 40)
      if (items.length > 0) {
        groups.push({ id: randomUUID().slice(0, 8), category, items })
        continue
      }
    }

    const items = line.split(/[,|•·\/]/g).map(s => s.trim()).filter(s => s.length > 1 && s.length < 40)
    if (items.length >= 2) {
      const last = groups[groups.length - 1]
      if (last && last.category === 'Skills') last.items.push(...items)
      else groups.push({ id: randomUUID().slice(0, 8), category: 'Skills', items })
    } else if (items.length === 1 && line.trim().length < 30) {
      const last = groups[groups.length - 1]
      if (last) last.items.push(items[0])
    }
  }

  return groups.filter(g => g.items.length > 0)
}

function parseProjects(lines: string[]): Project[] {
  if (!lines.length) return []
  const projects: Project[] = []

  interface ProjBuf { name: string; description: string; tech: string[]; link: string; repo: string }
  let current: ProjBuf | null = null

  function flush() {
    if (current?.name) projects.push({ id: randomUUID().slice(0, 8), ...current })
    current = null
  }

  for (const line of lines) {
    const bullet = isBulletLine(line)
    const techMatch = line.match(/^(?:Tech(?:nologies)?|Stack|Built\s+with|Tools?)[:\s]+(.+)/i)
    const urlMatch = line.match(/https?:\/\/[^\s)]+/)

    if (techMatch && current) {
      current.tech = techMatch[1].split(/[,|\/]/g).map(s => s.trim()).filter(Boolean)
    } else if (urlMatch && current) {
      const url = urlMatch[0]
      if (url.includes('github.com')) current.repo = url
      else current.link = url
    } else if (bullet && current) {
      const text = stripBullet(line)
      current.description += (current.description ? ' ' : '') + text
    } else if (!bullet && line.trim()) {
      flush()
      current = { name: line.trim(), description: '', tech: [], link: '', repo: '' }
    }
  }
  flush()

  return projects
}

function parseCertifications(lines: string[]): Certification[] {
  return lines
    .filter(l => l.trim())
    .map(l => ({
      id: randomUUID().slice(0, 8),
      name: stripBullet(l.trim()),
      issuer: '',
      date: '',
    }))
}

function parseAchievements(lines: string[]): string[] {
  return lines
    .filter(l => l.trim())
    .map(l => stripBullet(l.trim()))
    .filter(Boolean)
}

export function parseResumeText(text: string): ResumeData {
  const sections = splitIntoSections(text)

  const emailMatch = text.match(EMAIL_RE)
  const phoneMatch = text.match(PHONE_RE)
  const linkedinMatch = text.match(LINKEDIN_RE)
  const githubMatch = text.match(GITHUB_RE)

  const linkedin = linkedinMatch?.[0]?.replace(/\/$/, '') || ''
  const github = githubMatch?.[0]?.replace(/\/$/, '') || ''
  const name = extractName(sections.header)
  const location = extractLocation(sections.header.join(' ') + ' ' + text.slice(0, 500))
  const website = extractWebsite(text, linkedin, github)

  return {
    personal: {
      name,
      email: emailMatch?.[0] || '',
      phone: phoneMatch?.[0]?.trim() || '',
      location,
      linkedin,
      github,
      website,
    },
    summary: sections.summary.join(' ').trim(),
    education: parseEducation(sections.education),
    skills: parseSkills(sections.skills),
    projects: parseProjects(sections.projects),
    experience: parseExperience(sections.experience),
    certifications: parseCertifications(sections.certifications),
    achievements: parseAchievements(sections.achievements),
  }
}
