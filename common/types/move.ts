import { Allocation } from './allocation'
import { GenericEvent } from './generic_event'
import { Location } from './location'
import { Lodging } from './lodging'
import { Profile } from './profile'
import { Supplier } from './supplier'
import { ExtraditionFlight } from "./extradition_flight";

export interface Move {
  date: string
  reference: string
  profile?: Profile
  time_due?: Date | string
  status:
    | 'proposed'
    | 'requested'
    | 'booked'
    | 'in_transit'
    | 'completed'
    | 'cancelled'
  from_location: Location
  to_location?: Location
  move_type:
    | 'court_appearance'
    | 'court_other'
    | 'hospital'
    | 'police_transfer'
    | 'prison_recall'
    | 'prison_remand'
    | 'prison_transfer'
    | 'video_remand'
    | 'extradition'
    | 'approved_premises'
  id: string
  _vehicleRegistration?: string
  _expectedCollectionTime?: string
  _expectedArrivalTime?: string
  _hasLeftCustody?: boolean
  _hasArrived?: boolean
  important_events?: GenericEvent[]
  timeline_events?: GenericEvent[]
  meta?: {
    vehicle_registration?: string | null
    expected_collection_time?: string | null
    expected_time_of_arrival?: string | null
  }
  is_lockout?: boolean
  _canEdit?: boolean
  _isPerLocked?: boolean
  _canEditPer?: boolean
  supplier?: Supplier
  is_lodging?: boolean
  allocation?: Allocation
  lodgings?: Lodging[]
  extradition_flight?: ExtraditionFlight
  rebook?: boolean
  cancellation_reason?: string
}
