import { EventDetails } from './event-details'
import { Journey } from './journey'
import { Move } from './move'
import { Person } from './person'
import { PersonEscortRecord } from './person-escort-record'

export interface Event {
  id: string
  event_type?: string
  classification?: string
  occurred_at: string
  recorded_at?: string
  notes?: string | null
  created_by?: string | null
  eventable?: Journey | Move | PersonEscortRecord | Person
  supplier?: string
  details: EventDetails
  _index?: number
}
