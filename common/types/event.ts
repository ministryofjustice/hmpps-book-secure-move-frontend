import { EventDetails } from './event-details'
import { PersonEscortRecord } from './person-escort-record'
import { Move } from './move'
import { Journey } from './journey'
import { Person } from './person'

export interface Event {
  id: string
  event_type?: string
  classification?: string
  occurred_at?: string
  recorded_at?: string
  notes?: string
  created_by?: string
  eventable?: Journey | Move | PersonEscortRecord | Person
  supplier?: string
  details: EventDetails
}
