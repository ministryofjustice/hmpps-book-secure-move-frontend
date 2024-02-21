import { Location } from './location'

export interface Lodging {
  id: string
  type: 'lodgings'
  start_date: string
  end_date: string
  location: Location
}
