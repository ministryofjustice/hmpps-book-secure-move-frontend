import { Journey } from './journey'
import { Move } from './move'

export interface BasmRequest {
  journeys: Journey[]
  move: Move
  canAccess: (permission: string) => boolean
}
