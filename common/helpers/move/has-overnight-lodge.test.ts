import { Move } from '../../types/move'
import { expect } from 'chai'
import { hasOvernightLodge } from './has-overnight-lodge'
import { equal } from 'assert'

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
  timeline_events: undefined

}


describe ('Move' , function () {
  // @ts-ignore

  context ('with no events', function() {
    it ('should not be marked as a lodging', function () {
      expect(equal(hasOvernightLodge(baseMove),false))
    })
  })
})
