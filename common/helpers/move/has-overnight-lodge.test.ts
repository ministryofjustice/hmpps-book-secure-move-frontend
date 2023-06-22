import { equal } from 'assert'

import { expect } from 'chai'

import { GenericEvent } from '../../types/generic_event'
import { Move } from '../../types/move'

import { hasOvernightLodge } from './has-overnight-lodge'

const baseMove: Move = {
  date: '',
  id: '',
  profile: {
    id: '',
    person: {},
  },
  from_location: {
    id: '',
    key: '',
    title: '',
    type: 'locations',
    location_type: 'court',
  },
  status: 'requested',
  move_type: 'court_appearance',
  important_events: undefined,
  timeline_events: undefined,
}

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
