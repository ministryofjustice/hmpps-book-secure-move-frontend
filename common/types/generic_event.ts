import { EventDetails } from './event-details'
import { Journey } from './journey'
import { Move } from './move'
import { Person } from './person'
import { PersonEscortRecord } from './person-escort-record'
import { Supplier } from "./supplier";

export interface GenericEvent {
  id: string
  event_type?: string
  classification?: string
  occurred_at: string
  recorded_at?: string
  notes?: string | null
  created_by?: string | null
  eventable?: Journey | Move | PersonEscortRecord | Person
  supplier?: Supplier | null
  details: EventDetails
  _index?: number
}
