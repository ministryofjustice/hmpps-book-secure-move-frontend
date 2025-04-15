import I18n from '../../config/i18n'
import { LodgingService } from '../services/lodging'
import { Allocation } from './allocation'

import { BasmError } from './basm_error'
import { Journey } from './journey'
import { Lodging } from './lodging'
import { Move } from './move'
import { Service } from './service'
import { SessionModel } from './session_model'
import { SupplierService } from '../services/supplier'
import { EventService } from '../services/event'

interface Session {
  authExpiry: number
  save: () => void
  regenerate: (func: (error: BasmError) => void) => void
  user: {
    id: string
    permissions: never[]
  }
  [key: string]: any
}

export interface BasmRequest extends Express.Request {
  body: any
  allocation?: Allocation
  canAccess: (permission: string) => boolean
  connection: {
    remoteAddress?: string
    socket?: { remoteAddress?: string }
  }
  socket: { remoteAddress?: string }
  flash: (yeah: any, nah: any) => void
  form?: {
    options: {
      fields: { [key: string]: any }
      next: string
      steps?: any
      [x: string]: unknown
    }
    values: { [key: string]: any }
  }
  headers: { [key: string]: string }
  initialStep?: any
  journeyModel: SessionModel
  journeys: Journey[]
  move: Move
  lodging?: Lodging
  params: any
  session: Session
  sessionModel: SessionModel
  services: {
    allocation: Service
    lodging: LodgingService
    supplier: SupplierService
    event: EventService
  }
  t: typeof I18n.t
  user: {
    id: string
    username: string
    permissions: never[]
  }
  url: string
}
