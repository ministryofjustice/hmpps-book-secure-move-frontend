import { Allocation } from './allocation'
import { Journey } from './journey'
import { Move } from './move'
import { Service } from './service'
import { SessionModel } from './session_model'

export interface BasmRequest extends Express.Request {
  allocation?: Allocation
  canAccess: (permission: string) => boolean
  form?: {
    options: {
      fields: object
      next: string
    }
    values: any
  }
  initialStep?: any
  journeys: Journey[]
  move: Move
  services?: {
    allocation: Service
  }
  sessionModel?: SessionModel
}
