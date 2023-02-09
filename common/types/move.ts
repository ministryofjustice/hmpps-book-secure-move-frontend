import { Event } from './event'
import { Location } from './location'
import { Profile } from './profile'

export interface Move {
  profile: Profile
  status:
    | 'proposed'
    | 'requested'
    | 'booked'
    | 'in-transit'
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
  id: string
  _vehicleRegistration?: string
  _expectedCollectionTime?: string
  _expectedArrivalTime?: string
  _hasLeftCustody?: boolean
  _hasArrived?: boolean
  important_events?: Event[]
  timeline_events?: Event[]
  meta?: {
    vehicle_registration?: string | null
    expected_collection_time?: string | null
    expected_time_of_arrival?: string | null
  }
  is_lockout?: boolean
  _canEdit?: boolean
  _isPerLocked?: boolean
}
