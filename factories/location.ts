import { Factory } from 'fishery'

import { Location } from '../common/types/location'

export const LocationFactory = Factory.define<Location>(() => ({
  id: 'a15957ec-c983-4d29-98e4-334060b16dca',
  key: 'AAA',
  location_type: 'prison',
  title: 'HMP Adelaide',
  type: 'locations',
  extradition_capable: false,
}))
