import { Factory } from 'fishery'

import { LodgingService } from '../common/services/lodging'
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
    save: () => {},
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
  },
  t: I18n.t,
}

export const BasmRequestFactory = Factory.define<BasmRequest>(
  () => ({
    ...defaultParams,
    getMove: function() {
      return this.move
    },
  })
)
