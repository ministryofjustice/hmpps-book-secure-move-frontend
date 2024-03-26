import { Factory } from 'fishery'

import { moveTransformer } from '../common/lib/api-client/transformers'
import { Move } from '../common/types/move'

import { LocationFactory } from './location'

export const MoveFactory = Factory.define<Move>(({ afterBuild }) => {
  afterBuild(move => {
    moveTransformer(move)
  })

  return {
    from_location: LocationFactory.build(),
    id: '35957119-7e39-4c1f-9e0b-62f465ad007d',
    move_type: 'prison_transfer',
    profile: undefined,
    status: 'requested',
    date: '2022-01-01',
    reference: 'ABC1234D',
  }
})
