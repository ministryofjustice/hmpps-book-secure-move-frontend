import I18n from '../../config/i18n'

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
      fields: { [key: string]: any }
      next: string
    }
    values: { [key: string]: any }
  }
  initialStep?: any
  journeys: Journey[]
  move: Move
  services?: {
    allocation: Service
  }
  sessionModel?: SessionModel
  t: typeof I18n.t

}
