import { Location } from './location'
import { Vehicle } from './vehicle'

export interface Journey {
  from_location: Location
  to_location: Location
  vehicle?: Vehicle
}
