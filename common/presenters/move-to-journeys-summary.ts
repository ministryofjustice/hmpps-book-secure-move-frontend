import { addDays, differenceInDays, format, parseISO } from 'date-fns'

import { MoveOvernightLodge } from '../types/generic_events/move_overnight_lodge'
import { Journey } from '../types/journey'
import { Location } from '../types/location'
import { Move } from '../types/move'

const filters = require('../../config/nunjucks/filters')

interface PresentParameters {
  status?: string
  date: string
  from_location?: Location
  to_location?: Location
  isLodge?: boolean
  lodge?: MoveOvernightLodge
  timestamp: number
}

const presentMoveOrJourney = (
  moveOrJourney: Move | PresentParameters,
  formatDate: typeof filters.formatDate
) => ({
  context: moveOrJourney.status,
  date: formatDate(moveOrJourney.date),
  fromLocation: moveOrJourney.from_location?.title,
  toLocation: moveOrJourney.to_location?.title,
})

const presentLockout = (move: Move, formatDate: typeof filters.formatDate) => [
  {
    fromLocation: move.from_location?.title,
    toLocation: '(awaiting destination)',
    date: formatDate(move.date),
  },
  {
    fromLocation: '(awaiting location)',
    toLocation: move.to_location?.title,
    date: '(awaiting date)',
  },
]

export function moveToJourneysSummary(
  move: Move,
  journeys: Journey[],
  { formatDate = filters.formatDate } = {}
) {
  const filteredJourneys = journeys.filter(
    ({ state }) => state !== 'rejected' && state !== 'cancelled'
  )

  const hasJourneysOnDifferentDay =
    filteredJourneys.filter(({ date }) => date !== move.date).length !== 0

  const overnightLodges = (move.timeline_events
    ?.filter(e => e.event_type === 'MoveOvernightLodge')
    .sort((a, b) =>
      (b.details.end_date || '') > (a.details.end_date || '') ? -1 : 1
    ) || []) as MoveOvernightLodge[]

  if (!overnightLodges.length) {
    if (!hasJourneysOnDifferentDay) {
      if (move.is_lockout) {
        return presentLockout(move, formatDate)
      }

      return [presentMoveOrJourney(move, formatDate)]
    }
  }

  const journeysWithLodges: PresentParameters[] = [
    ...filteredJourneys.map(journey => {
      return {
        date: journey.date,
        status: journey.state,
        from_location: journey.from_location,
        to_location: journey.to_location,
        timestamp: journey.client_timestamp,
      }
    }),
  ]

  if (overnightLodges.length) {
    const lodgesPresentData = overnightLodges.map((lodge, i) => {
      const from = i > 0 ? overnightLodges[i - 1].location : move.from_location

      return {
        date: lodge.details.start_date as string, // casting because start_date is validated by api
        status: 'proposed',
        from_location: from,
        to_location: lodge.location,
        isLodge: true,
        lodge,
        timestamp: Date.parse(lodge.occurred_at.replace(' +', '+')),
      }
    })

    journeysWithLodges.push(
      ...lodgesPresentData.filter((lodge, i) => {
        // filter out any lodges that have journeys, to avoid duplication
        return !filteredJourneys.find(
          journey =>
            journey.from_location.id === lodge.from_location.id &&
            journey.to_location.id === lodge.to_location.id
        )
      })
    )

    // order by date, then by creation order
    journeysWithLodges.sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    journeysWithLodges
      .filter(journeyOrLodge => !journeyOrLodge.isLodge)
      .forEach(journey => {
        journey.lodge = lodgesPresentData.find(
          lodge =>
            journey.from_location?.id === lodge.from_location.id &&
            journey.to_location?.id === lodge.to_location.id
        )?.lodge
      })

    const lastJourney = journeysWithLodges[journeysWithLodges.length - 1]

    // if the last journey is a lodge, we need to add a fake journey from that
    //   lodge to complete the move
    if (lastJourney.isLodge && lastJourney.lodge) {
      journeysWithLodges.push({
        date: lastJourney.lodge.details.end_date as string,
        status: 'proposed',
        from_location: lastJourney.lodge.location,
        to_location: move.to_location,
        timestamp: lastJourney.timestamp,
      })
    } else if (lastJourney.to_location?.id !== move.to_location?.id) {
      let date = format(addDays(parseISO(lastJourney.date), 1), 'yyyy-MM-dd')

      if (lastJourney.lodge) {
        const lodgeLength = differenceInDays(
          parseISO(lastJourney.lodge.details.end_date as string),
          parseISO(lastJourney.lodge.details.start_date as string)
        )
        date = format(
          addDays(parseISO(lastJourney.date), lodgeLength),
          'yyyy-MM-dd'
        )
      }

      journeysWithLodges.push({
        date,
        status: 'proposed',
        from_location: lastJourney.to_location,
        to_location: move.to_location,
        timestamp: lastJourney.timestamp,
      })
    }
  }

  return journeysWithLodges.map(journey =>
    presentMoveOrJourney(journey, formatDate)
  )
}
