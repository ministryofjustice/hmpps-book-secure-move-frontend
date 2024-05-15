import { ComplexCase } from "./complex_case"
import { Location } from "./location"
import { Move } from "./move"

export interface ExtraditionFlight {
  id: string
  type: 'extradition_flight'
  flight_time: string
  flight_number: string
}
