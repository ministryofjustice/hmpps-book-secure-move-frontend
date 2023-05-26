import { Factory } from 'fishery'
import { Allocation } from '../common/types/allocation'
import locationFactory from './location'
import moveFactory from './move'

const allocationFactory = Factory.define<Allocation>(({ afterBuild }) => {
  afterBuild(allocation => {
    allocation.moves.forEach((move) => { move.allocation = allocation })
  })

  return {
    id: '1c5b9f9a-2d70-4b4e-b5a3-6736b83c8bd9',
    date: '2023-04-01',
    from_location: locationFactory.build(),
    moves_count: 2,
    moves: moveFactory.buildList(2),
    status: 'filled',
    to_location: locationFactory.build()
  }
})

export default allocationFactory