import { Journey } from './journey'
import { Move } from './move'
import { Person } from './person'
import { PersonEscortRecord } from './person-escort-record'

export interface EventDetails {
  updateAuthor?: string
  updateSection?: string
  section?: string
  context?: string
  journey?: Journey
  move?: Move
  person?: Person
  person_escort_record?: PersonEscortRecord
  expected_time?: string
  supplier_personnel_number?: number
  supplier_personnel_numbers?: number[]
  police_personnel_number?: number
  police_personnel_numbers?: number[]
  vehicle_type?: string
  vehicle_reg?: string
  previous_vehicle_reg?: string
  reported_at?: string
  fault_classification?: string
  advised_at?: string
  advised_by?: string
  treated_at?: string
  treated_by?: string
  date?: string
  create_in_nomis?: boolean
  cancellation_reason?: string
  cancellation_reason_comment?: string
  previous_move_reference?: string
  authorised_at?: string
  authorised_by?: string
  reason?: string
  expected_at?: string
  court_cell_number?: string
  move_type?: string
  rejection_reason?: string
  rebook?: boolean
  completed_at?: string
  responded_by?:
    | {
        'risk-information'?: Array<string | undefined>
        'offence-information'?: Array<string | undefined>
        'health-information'?: Array<string | undefined>
        'property-information'?: Array<string | undefined>
      }
    | string
  confirmed_at?: string
  subtype?: string
  ended_at?: string
  is_virtual?: boolean
  is_trial?: boolean
  court_listing_at?: string
  started_at?: string
  agreed_at?: string
  court_outcome?: string
  given_at?: string
  outcome?: string
  postcode?: string
  location_description?: string
  riskUsers?: string
  offenceUsers?: string
  healthUsers?: string
  propertyUsers?: string
  start_date?: string
  end_date?: string
}
