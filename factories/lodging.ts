import { Factory } from 'fishery'

import { Lodging } from '../common/types/lodging'

import { LocationFactory } from './location'

export const LodgingFactory = Factory.define<Lodging>(({ afterBuild }) => {
  afterBuild(obj => {})

  return {
    type: 'lodgings',
    id: '35957119-7e39-4c1f-9e0b-62f465ad007d',
    location: LocationFactory.build(),
    start_date: '2022-01-01',
    end_date: '2022-01-02',
  }
})
