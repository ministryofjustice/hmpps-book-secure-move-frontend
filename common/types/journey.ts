import { Location } from './location'
import { Vehicle } from './vehicle'

export interface Journey {
  from_location: Location
  to_location: Location
  vehicle?: Vehicle
  state: 'proposed' | 'rejected' | 'in_progress' | 'completed' | 'cancelled'
  date: string
  client_timestamp: number
}
