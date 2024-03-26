import { Move } from '../../types/move'

export function hasOvernightLodge(move: Move): boolean {
  const importantEvents = move.important_events || []

  const hasOvernightLodge = !!move.lodgings?.length
  const hasLodgingStart = importantEvents
    .flatMap(e => e.event_type)
    .includes('MoveLodgingStart')

  return hasLodgingStart || hasOvernightLodge
}
