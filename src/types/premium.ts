export interface SectionScore {
  score: number
  max: number
  issues: string[]
}

export interface BulletSuggestion {
  original: string
  tip: string
}

export interface ScoreResult {
  total: number
  label: 'Weak' | 'Fair' | 'Good' | 'Strong'
  sections: {
    completeness: SectionScore
    content: SectionScore
    skills: SectionScore
    ats: SectionScore
  }
  bulletSuggestions: BulletSuggestion[]
  suggestedKeywords: string[]
}

export interface AIFeedback {
  overallFeedback: string
  bulletImprovements: { original: string; improved: string; rating: number }[]
  missingKeywords: string[]
  atsScore: number
  topIssues: string[]
}
