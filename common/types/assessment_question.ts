import { ApiObjectWithTimestamps } from './api_object_with_timestamps'

export interface AssessmentQuestion extends ApiObjectWithTimestamps {
  disabled_at?: string
  category: string
  key: string
  title: string
}
