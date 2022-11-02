import { Person } from './person'
import { PersonEscortRecord } from './person-escort-record'

export interface Profile {
  id: string;
  person: Person;
  person_escort_record?: PersonEscortRecord;
}
