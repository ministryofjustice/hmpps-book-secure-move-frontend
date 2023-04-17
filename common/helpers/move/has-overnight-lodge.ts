import { Move } from '../../types/move'

export function hasOvernightLodge(move: Move): boolean {
  const importantEvents = move.important_events || []
  const timelineEvents = move.timeline_events || []

  const hasOvernightLodge = timelineEvents.flatMap(e => e.event_type).includes('MoveOvernightLodge')
  const hasLodgingStart = importantEvents.flatMap(e => e.event_type).includes('MoveLodgingStart')

  return (hasLodgingStart || hasOvernightLodge)
}
