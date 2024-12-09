import { ApiObjectWithTimestamps } from './api_object_with_timestamps'

export interface Region extends ApiObjectWithTimestamps {
  key: string
  name: string
}
