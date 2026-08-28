import { Move } from '../../types/move'

export function hasLodge(move: Move): boolean {
  const importantEvents = move.important_events || []

  const hasLodgingResource = !!move.lodgings?.length
  const hasLodgingStart = importantEvents
    .flatMap(e => e.event_type)
    .includes('MoveLodgingStart')

  return hasLodgingStart || hasLodgingResource
}
