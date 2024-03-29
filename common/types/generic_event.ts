import { EventDetails } from './event-details'
import { Journey } from './journey'
import { Move } from './move'
import { Person } from './person'
import { PersonEscortRecord } from './person-escort-record'

export interface GenericEvent {
  id: string
  event_type?: string
  classification?: string
  occurred_at: string
  recorded_at?: string
  notes?: string | null
  created_by?: string | null
  eventable?: Journey | Move | PersonEscortRecord | Person
  supplier?: string | null
  details: EventDetails
  _index?: number
}
