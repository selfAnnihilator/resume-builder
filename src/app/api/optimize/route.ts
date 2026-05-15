import { ResumeData } from '@/types/resume'
import { AIFeedback } from '@/types/premium'
import { analyzeResume } from '@/lib/scoring'

const KNOWN_VERBS = new Set([
  'built', 'developed', 'designed', 'implemented', 'led', 'managed', 'created',
  'improved', 'increased', 'reduced', 'delivered', 'deployed', 'architected',
  'automated', 'optimized', 'launched', 'maintained', 'integrated', 'migrated',
  'refactored', 'mentored', 'analyzed', 'wrote', 'tested', 'engineered',
  'streamlined', 'spearheaded', 'drove', 'coordinated', 'established',
])

const STRONG_VERBS = ['Built', 'Developed', 'Implemented', 'Led', 'Engineered', 'Designed',
  'Deployed', 'Automated', 'Optimized', 'Launched', 'Architected', 'Delivered']

function improveBullet(bullet: string): string {
  const trimmed = bullet.trim()
  const firstWord = trimmed.split(/\s+/)[0]?.toLowerCase() ?? ''
  let improved = trimmed

  if (!KNOWN_VERBS.has(firstWord)) {
    const verb = STRONG_VERBS[trimmed.charCodeAt(0) % STRONG_VERBS.length]
    improved = `${verb} ${improved.charAt(0).toLowerCase()}${improved.slice(1)}`
  }

  if (!/\d+/.test(improved)) {
    improved = improved.replace(/[.,]?\s*$/, '') + ', improving team efficiency by ~20%'
  }

  return improved
}

function rateBullet(bullet: string): number {
  let score = 2
  const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
  if (KNOWN_VERBS.has(firstWord)) score++
  if (/\d+/.test(bullet)) score++
  if (bullet.length > 60) score++
  return Math.min(5, Math.max(1, score))
}

function generateOverallFeedback(total: number, resume: ResumeData): string {
  const name = resume.personal.name || 'Your resume'
  if (total >= 80) {
    return `${name} is in great shape! It covers all the key areas recruiters and ATS systems look for. Focus on quantifying more of your achievements and ensuring your LinkedIn is current to maximize your chances.`
  } else if (total >= 60) {
    return `${name} has a solid foundation with clear opportunities to improve. Strengthening your experience bullets with action verbs and metrics, and expanding your skills section will significantly boost your ATS score.`
  } else if (total >= 40) {
    return `${name} needs some work before it's ready for competitive roles. The most impactful changes are adding a professional summary, expanding your skills section, and rewriting experience bullets with strong action verbs and quantifiable results.`
  }
  return `${name} is missing several sections that recruiters expect. Start by completing your contact information, adding a professional summary, and listing your education and skills — these foundational changes will make a big difference.`
}

export async function POST(request: Request) {
  try {
    const { resume }: { paymentId: string; resume: ResumeData } = await request.json()

    const result = analyzeResume(resume)
    const allBullets = resume.experience.flatMap(e => e.bullets.filter(Boolean))

    const bulletImprovements = allBullets.slice(0, 10).map(bullet => ({
      original: bullet,
      improved: improveBullet(bullet),
      rating: rateBullet(bullet),
    }))

    const topIssues = [
      ...result.sections.completeness.issues,
      ...result.sections.content.issues,
      ...result.sections.skills.issues,
      ...result.sections.ats.issues,
    ].slice(0, 3)

    const feedback: AIFeedback = {
      overallFeedback: generateOverallFeedback(result.total, resume),
      bulletImprovements,
      missingKeywords: result.suggestedKeywords.slice(0, 3),
      atsScore: result.total,
      topIssues,
    }

    return Response.json(feedback)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[optimize]', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
