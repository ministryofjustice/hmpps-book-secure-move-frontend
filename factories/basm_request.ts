import { Factory } from 'fishery'

import { EventService } from '../common/services/event'
import { LodgingService } from '../common/services/lodging'
import { SupplierService } from '../common/services/supplier'
import { BasmError } from '../common/types/basm_error'
import { BasmRequest } from '../common/types/basm_request'
import I18n from '../config/i18n'

import { MoveFactory } from './move'

export const defaultParams = {
  canAccess: (permission: string) => true,
  journeyModel: {
    reset: () => {},
    set: () => {},
    toJSON: () => {},
  },
  journeys: [],
  move: MoveFactory.build(),
  params: {},
  session: {
    authExpiry: 17416129189670,
    regenerate: (_func: (error: BasmError) => void) => {},
    save: () => {},
    user: {
      id: '',
      permissions: [],
    },
  },
  sessionModel: {
    reset: () => {},
    set: () => {},
    toJSON: () => ({}),
  },
  services: {
    allocation: {
      update: () => {},
    },
    lodging: new LodgingService(),
    supplier: new SupplierService(),
    event: new EventService(),
  },
  t: I18n.t,
  body: {},
  flash: (type: string, message: string) => {},
  user: {
    id: '',
    permissions: [],
  },
  headers: {},
  connection: {},
  socket: {},
}

export const BasmRequestFactory = Factory.define<BasmRequest>(() => ({
  ...defaultParams,
  getMove: function () {
    return this.move
  },
}))
