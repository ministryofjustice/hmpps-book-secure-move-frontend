import { Framework } from './framework'
import { FrameworkResponse } from './framework_response'

export interface Assessment {
  id: string
  framework?: Framework
  _framework?: Framework
  responses?: FrameworkResponse[]
  meta?: {
    section_progress: { key: string; status: string }[]
  }
  status?: string
  flags?: string[]
}
