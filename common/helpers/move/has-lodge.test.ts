import { equal } from 'assert'

import { expect } from 'chai'

import { LodgingFactory } from '../../../factories/lodging'
import { MoveFactory } from '../../../factories/move'
import { GenericEvent } from '../../types/generic_event'

import { hasLodge } from './has-lodge'

const baseMove = MoveFactory.build()

const mlsEvent: GenericEvent = {
  id: '',
  occurred_at: '',
  details: {},
  event_type: 'MoveLodgingStart',
}

describe('Move', function () {
  context('with no events', function () {
    it('should not be marked as a lodging', function () {
      expect(equal(hasLodge(baseMove), false))
    })
  })
  context('with a MoveLodgingStart event', function () {
    it('should be marked as a lodging', function () {
      baseMove.important_events = [mlsEvent]
      expect(equal(hasLodge(baseMove), true))
    })
  })
  context('when the move has Lodgings', function () {
    it('should be marked as a lodging', function () {
      baseMove.lodgings = [LodgingFactory.build()]
      expect(equal(hasLodge(baseMove), true))
    })
  })
})
