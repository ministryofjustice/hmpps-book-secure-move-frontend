import { ApiObject } from './api_object'

export interface ApiObjectWithTimestamps extends ApiObject {
  created_at: string
  updated_at: string
}
