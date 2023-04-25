import { Factory } from 'fishery'

import { moveTransformer } from '../common/lib/api-client/transformers'
import { Move } from '../common/types/move'

import locationFactory from './location'

const moveFactory = Factory.define<Move>(({ afterBuild }) => {
  afterBuild(move => {
    moveTransformer(move)
  })

  return {
    from_location: locationFactory.build(),
    id: '35957119-7e39-4c1f-9e0b-62f465ad007d',
    move_type: 'prison_transfer',
    profile: undefined,
    status: 'requested',
    date: '2022-01-01',
  }
})

export default moveFactory
