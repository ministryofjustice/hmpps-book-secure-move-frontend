import { Factory } from 'fishery'

import { Journey } from '../common/types/journey'

import { LocationFactory } from './location'

export const JourneyFactory = Factory.define<Journey>(({ afterBuild }) => {
  afterBuild(journey => {})

  return {
    from_location: LocationFactory.build(),
    to_location: LocationFactory.build(),
    id: '35957119-7e39-4c1f-9e0b-62f465ad007d',
    state: 'proposed',
    date: '2022-01-01',
    client_timestamp: new Date(2021, 11, 28, 12, 12).getTime(),
  }
})
