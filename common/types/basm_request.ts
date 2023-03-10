import I18n from '../../config/i18n'

import { Allocation } from './allocation'
import { Journey } from './journey'
import { Move } from './move'
import { Service } from './service'
import { SessionModel } from './session_model'

export interface BasmRequest extends Express.Request {
  allocation?: Allocation
  canAccess: (permission: string) => boolean
  flash?: (yeah: any, nah: any) => void
  form?: {
    options: {
      fields: { [key: string]: any }
      next: string
    }
    values: { [key: string]: any }
  }
  initialStep?: any
  journeys: Journey[]
  move: Move
  t: typeof I18n.t
  services?: {
    allocation: Service
  }
  session?: {
    save: () => void
  }
  sessionModel?: SessionModel
  t: typeof I18n.t
}
