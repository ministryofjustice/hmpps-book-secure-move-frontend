import { equal } from 'assert'

import { expect } from 'chai'

import { MoveFactory } from '../../../factories/move'
import { GenericEvent } from '../../types/generic_event'

import { hasOvernightLodge } from './has-overnight-lodge'

const baseMove = MoveFactory.build()

const mlsEvent: GenericEvent = {
  id: '',
  occurred_at: '',
  details: {},
  event_type: 'MoveLodgingStart',
}

const molEvent: GenericEvent = {
  id: '',
  occurred_at: '',
  details: {},
  event_type: 'MoveOvernightLodge',
}

describe('Move', function () {
  context('with no events', function () {
    it('should not be marked as a lodging', function () {
      expect(equal(hasOvernightLodge(baseMove), false))
    })
  })
  context('with a MoveLodgingStart event', function () {
    it('should be marked as a lodging', function () {
      baseMove.important_events = [mlsEvent]
      expect(equal(hasOvernightLodge(baseMove), true))
    })
  })
  context('with a MoveOvernightLodge event', function () {
    it('should be marked as a lodging', function () {
      baseMove.timeline_events = [molEvent]
      expect(equal(hasOvernightLodge(baseMove), true))
    })
  })
})
