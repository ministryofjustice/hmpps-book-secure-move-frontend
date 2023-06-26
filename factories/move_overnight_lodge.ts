import { Factory } from 'fishery'

import { MoveOvernightLodge } from '../common/types/generic_events/move_overnight_lodge'

import { LocationFactory } from './location'

export const MoveOvernightLodgeFactory = Factory.define<MoveOvernightLodge>(
  ({ afterBuild }) => {
    afterBuild(moveOvernightLodge => {})

    return {
      id: 'id',
      location: LocationFactory.build(),
      occurred_at: '2023-04-24 17:24:05.709503000 +0100',
      details: {
        start_date: '2023-04-25',
        end_date: '2023-04-26',
      },
      event_type: 'MoveOvernightLodge',
    }
  }
)
