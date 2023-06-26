import { GenericEvent } from '../generic_event'
import { Location } from '../location'

export interface MoveOvernightLodge extends GenericEvent {
  location: Location
}
