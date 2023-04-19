import { ComplexCase } from "./complex_case"
import { Location } from "./location"
import { Move } from "./move"

export interface Allocation {
  id: string
  moves_count: number
  date: string
  estate?: string
  estate_comment?: string
  prisoner_category?: string
  sentence_length?: string
  sentence_length_comment?: string
  complex_cases?: ComplexCase[]
  complete_in_full?: boolean
  requested_by?: string
  other_criteria?: string
  status?:
    | 'cancelled'
    | 'filled'
    | 'unfilled'
  cancellation_reason?: string
  cancellation_reason_comment?: string
  created_at?: string
  updated_at?: string
  from_location: Location
  to_location: Location
  moves: Move[]
  meta?: {
    moves: {
      total: number
      filled: number
      unfilled: number
    },
  },
}