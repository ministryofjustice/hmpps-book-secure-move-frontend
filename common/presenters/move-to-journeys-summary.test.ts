import { expect } from 'chai'

import { JourneyFactory } from '../../factories/journey'
import { LocationFactory } from '../../factories/location'
import { LodgingFactory } from '../../factories/lodging'
import { MoveFactory } from '../../factories/move'
import { Journey } from '../types/journey'
import { Move } from '../types/move'

import { moveToJourneysSummary } from './move-to-journeys-summary'

const LOCATIONS = {
  guildford: LocationFactory.build({
    id: 'guildford',
    title: 'Guildford Custody Suite',
  }),
  brixton: LocationFactory.build({
    id: 'brixton',
    title: 'HMP Brixton',
  }),
  wetherby: LocationFactory.build({
    id: 'wetherby',
    title: 'WETHERBY (HMPYOI)',
  }),
  exeter: LocationFactory.build({
    id: 'exeter',
    title: 'Exeter Probation Office',
  }),
}

describe('Presenters', function () {
  describe('.moveToJourneysSummary', function () {
    context(
      'when the move is not locked out and there is a journey on a different date',
      function () {
        it('will present the journeys correctly', function () {
          const move = MoveFactory.build({
            date: '2020-10-07',
            is_lockout: false,
            from_location: LOCATIONS.guildford,
            to_location: LOCATIONS.brixton,
          })

          const journeys = [
            JourneyFactory.build({
              date: '2021-01-13',
              from_location: LOCATIONS.wetherby,
              to_location: LOCATIONS.exeter,
            }),
          ]

          expect(moveToJourneysSummary(move, journeys)).to.deep.equal([
            {
              context: 'proposed',
              date: '13 Jan 2021',
              fromLocation: LOCATIONS.wetherby.title,
              toLocation: LOCATIONS.exeter.title,
            },
          ])
        })
      }
    )

    context(
      "when the move is not locked out and there is a journey on a different date but it's cancelled",
      function () {
        it('will present the journeys correctly', function () {
          const move = MoveFactory.build({
            date: '2020-10-07',
            is_lockout: false,
            from_location: LOCATIONS.guildford,
            to_location: LOCATIONS.brixton,
          })

          const journeys = [
            JourneyFactory.build({
              date: '2021-01-13',
              state: 'cancelled',
              from_location: LOCATIONS.wetherby,
              to_location: LOCATIONS.exeter,
            }),
          ]

          expect(moveToJourneysSummary(move, journeys)).to.deep.equal([
            {
              context: 'requested',
              date: '7 Oct 2020',
              fromLocation: LOCATIONS.guildford.title,
              toLocation: LOCATIONS.brixton.title,
            },
          ])
        })
      }
    )

    context(
      'when the move is locked out and there is one journey',
      function () {
        it('will present the journeys correctly', function () {
          const move = MoveFactory.build({
            date: '2020-10-07',
            is_lockout: true,
            from_location: LOCATIONS.guildford,
            to_location: LOCATIONS.brixton,
          })

          const journeys = [
            JourneyFactory.build({
              date: '2020-10-07',
              from_location: LOCATIONS.wetherby,
              to_location: LOCATIONS.exeter,
            }),
          ]

          expect(moveToJourneysSummary(move, journeys)).to.deep.equal([
            {
              date: '7 Oct 2020',
              fromLocation: LOCATIONS.guildford.title,
              toLocation: '(awaiting destination)',
            },
            {
              date: '(awaiting date)',
              fromLocation: '(awaiting location)',
              toLocation: LOCATIONS.brixton.title,
            },
          ])
        })
      }
    )

    context(
      'when the move is not locked out and there is a journey on the same date',
      function () {
        it('will present the journeys correctly', function () {
          const move = MoveFactory.build({
            date: '2020-10-07',
            is_lockout: false,
            from_location: LOCATIONS.guildford,
            to_location: LOCATIONS.brixton,
          })

          const journeys = [
            JourneyFactory.build({
              date: '2020-10-07',
              from_location: LOCATIONS.guildford,
              to_location: LOCATIONS.exeter,
            }),
          ]

          expect(moveToJourneysSummary(move, journeys)).to.deep.equal([
            {
              context: 'requested',
              date: '7 Oct 2020',
              fromLocation: LOCATIONS.guildford.title,
              toLocation: LOCATIONS.brixton.title,
            },
          ])
        })
      }
    )

    context('when the move has one planned lodge', function () {
      let move: Move
      let journeys: Journey[]

      beforeEach(function () {
        move = MoveFactory.build({
          date: '2020-10-07',
          is_lockout: false,
          from_location: LOCATIONS.guildford,
          to_location: LOCATIONS.brixton,
          lodgings: [
            LodgingFactory.build({
              location: LOCATIONS.exeter,
              start_date: '2020-10-07',
              end_date: '2020-10-08',
            }),
          ],
        })
        journeys = []
      })

      it('will present the lodge correctly', function () {
        expect(moveToJourneysSummary(move, journeys)).to.deep.equal([
          {
            context: 'proposed',
            date: '7 Oct 2020',
            fromLocation: LOCATIONS.guildford.title,
            toLocation: LOCATIONS.exeter.title,
          },
          {
            context: 'proposed',
            date: '8 Oct 2020',
            fromLocation: LOCATIONS.exeter.title,
            toLocation: LOCATIONS.brixton.title,
          },
        ])
      })

      context('when the move has a journey for the same lodge', function () {
        beforeEach(function () {
          journeys = [
            JourneyFactory.build({
              from_location: LOCATIONS.guildford,
              to_location: LOCATIONS.exeter,
              date: '2021-01-01',
              state: 'in_progress',
            }),
          ]
        })

        it('will present the lodge correctly', function () {
          expect(moveToJourneysSummary(move, journeys)).to.deep.equal([
            {
              context: 'in_progress',
              date: '1 Jan 2021',
              fromLocation: LOCATIONS.guildford.title,
              toLocation: LOCATIONS.exeter.title,
            },
            {
              context: 'proposed',
              date: '2 Jan 2021',
              fromLocation: LOCATIONS.exeter.title,
              toLocation: LOCATIONS.brixton.title,
            },
          ])
        })
      })
    })

    context('when the move has two planned lodges', function () {
      let move: Move
      let journeys: Journey[]

      beforeEach(function () {
        move = MoveFactory.build({
          date: '2020-10-07',
          is_lockout: false,
          from_location: LOCATIONS.guildford,
          to_location: LOCATIONS.brixton,
          lodgings: [
            LodgingFactory.build({
              location: LOCATIONS.exeter,
              start_date: '2020-10-07',
              end_date: '2020-10-12',
            }),
            LodgingFactory.build({
              location: LOCATIONS.wetherby,
              start_date: '2020-10-12',
              end_date: '2020-10-14',
            }),
          ],
        })
        journeys = []
      })

      it('will present the lodge correctly', function () {
        expect(moveToJourneysSummary(move, journeys)).to.deep.equal([
          {
            context: 'proposed',
            date: '7 Oct 2020',
            fromLocation: LOCATIONS.guildford.title,
            toLocation: LOCATIONS.exeter.title,
          },
          {
            context: 'proposed',
            date: '12 Oct 2020',
            fromLocation: LOCATIONS.exeter.title,
            toLocation: LOCATIONS.wetherby.title,
          },
          {
            context: 'proposed',
            date: '14 Oct 2020',
            fromLocation: LOCATIONS.wetherby.title,
            toLocation: LOCATIONS.brixton.title,
          },
        ])
      })

      context('when the move has a journey for the first lodge', function () {
        beforeEach(function () {
          journeys = [
            JourneyFactory.build({
              from_location: LOCATIONS.guildford,
              to_location: LOCATIONS.exeter,
              date: '2020-10-08',
              state: 'in_progress',
            }),
          ]
        })

        it('will present the lodge correctly', function () {
          expect(moveToJourneysSummary(move, journeys)).to.deep.equal([
            {
              context: 'in_progress',
              date: '8 Oct 2020',
              fromLocation: LOCATIONS.guildford.title,
              toLocation: LOCATIONS.exeter.title,
            },
            {
              context: 'proposed',
              date: '12 Oct 2020',
              fromLocation: LOCATIONS.exeter.title,
              toLocation: LOCATIONS.wetherby.title,
            },
            {
              context: 'proposed',
              date: '14 Oct 2020',
              fromLocation: LOCATIONS.wetherby.title,
              toLocation: LOCATIONS.brixton.title,
            },
          ])
        })
      })

      context('when the move has a journey for the second lodge', function () {
        beforeEach(function () {
          journeys = [
            JourneyFactory.build({
              from_location: LOCATIONS.exeter,
              to_location: LOCATIONS.wetherby,
              date: '2020-10-12',
              state: 'in_progress',
            }),
          ]
        })

        it('will present the lodge correctly', function () {
          expect(moveToJourneysSummary(move, journeys)).to.deep.equal([
            {
              context: 'proposed',
              date: '7 Oct 2020',
              fromLocation: LOCATIONS.guildford.title,
              toLocation: LOCATIONS.exeter.title,
            },
            {
              context: 'in_progress',
              date: '12 Oct 2020',
              fromLocation: LOCATIONS.exeter.title,
              toLocation: LOCATIONS.wetherby.title,
            },
            {
              context: 'proposed',
              date: '14 Oct 2020',
              fromLocation: LOCATIONS.wetherby.title,
              toLocation: LOCATIONS.brixton.title,
            },
          ])
        })
      })
    })
  })
})
