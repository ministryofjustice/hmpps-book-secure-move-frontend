import { findLast } from 'lodash'

// @ts-ignore // TODO: convert to ts
import presenters from '../../../../../common/presenters'
import { BasmRequest } from '../../../../../common/types/basm_request'

export default function localsMoveDetails(
  req: BasmRequest,
  res: any,
  next: any
) {
  const { journeys, move } = req

  res.locals.moveDetails = presenters.moveToMetaListComponent(move, journeys)
  res.locals.moveIsLockout = move.is_lockout
  res.locals.moveIsLodging = move.is_lodging
  res.locals.moveIsEditable = move._canEdit
  res.locals.isPerLocked = move._isPerLocked
  res.locals.moveId = move.id

  const importantEvents = move.important_events || []

  const latestLodgingStart = findLast(
    importantEvents,
    ({ event_type: eventType }) => eventType === 'MoveLodgingStart'
  )
  res.locals.moveLodgingStarted = !!latestLodgingStart
  res.locals.moveLodgingEnded = importantEvents.some(
    event =>
      event.event_type === 'MoveLodgingEnd' &&
      (!latestLodgingStart ||
        event.occurred_at > latestLodgingStart.occurred_at)
  )

  const handovers = presenters.moveToHandoversSummary(move, journeys, true)

  if (handovers.length >= 1) {
    if (move.is_lockout) {
      res.locals.moveLockoutHandover = handovers[handovers.length - 1]
    } else if (move.is_lodging) {
      res.locals.moveLodgingHandover = handovers[handovers.length - 1]
    }
  }

  next()
}
