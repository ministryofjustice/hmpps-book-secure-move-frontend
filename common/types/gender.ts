import { ApiObjectWithTimestamps } from './api_object_with_timestamps'

export interface Gender extends ApiObjectWithTimestamps {
  description?: string
  disabled_at?: string
  key: string
  nomis_code: string
  title: string
}
