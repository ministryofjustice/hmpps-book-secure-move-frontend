export interface YouthRiskAssessment {
  meta?: {
    section_progress: { key: string; status: string }[]
  }
  status: string
  flags?: string[]
}
