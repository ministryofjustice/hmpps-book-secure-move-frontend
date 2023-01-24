import { FrameworkQuestion } from './framework_question'

export interface Framework {
  name?: string
  version?: string
  sections?: {
    [key: string]: {
      name: string
      steps: {
        questions: {}[]
        slug: string
        type: string
        name: string
        next_step: string
        content_before_questions: string
        content_after_questions: string
      }[]
    }
  }
  questions?: { [key: string]: FrameworkQuestion }
}
