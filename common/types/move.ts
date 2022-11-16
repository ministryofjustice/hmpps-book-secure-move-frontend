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
}
