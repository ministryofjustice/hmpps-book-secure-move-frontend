import I18n from '../../config/i18n'

import { Journey } from './journey'
import { Move } from './move'

export interface BasmRequest {
  journeys: Journey[]
  move: Move
  canAccess: (permission: string) => boolean
  t: typeof I18n.t
  form: {
    options: {
      fields: { [key: string]: any }
    }
    values: { [key: string]: any }
  }
}
