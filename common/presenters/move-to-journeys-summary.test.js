const moveToJourneysSummary = require('./move-to-journeys-summary')

describe('Presenters', function () {
  describe('#moveToJourneys()', function () {
    context(
      'when the move is not locked out and there is a journey on a different date',
      function () {
        it('will present the journeys correctly', function () {
          const move = {
            date: '2020-10-07',
            is_lockout: false,
            from_location: {
              title: 'Guildford Custody Suite',
            },
            to_location: {
              title: 'HMP Brixton',
            },
          }

          const journeys = [
            {
              date: '2021-01-13',
              from_location: {
                title: 'WETHERBY (HMPYOI)',
              },
              to_location: {
                title: 'Exeter Probation Office',
              },
            },
          ]

          expect(moveToJourneysSummary(move, journeys)).to.deep.equal([
            {
              context: undefined,
              date: '13 Jan 2021',
              fromLocation: 'WETHERBY (HMPYOI)',
              toLocation: 'Exeter Probation Office',
            },
          ])
        })
      }
    )

    context(
      "when the move is not locked out and there is a journey on a different date but it's cancelled",
      function () {
        it('will present the journeys correctly', function () {
          const move = {
            date: '2020-10-07',
            is_lockout: false,
            from_location: {
              title: 'Guildford Custody Suite',
            },
            to_location: {
              title: 'HMP Brixton',
            },
          }

          const journeys = [
            {
              date: '2021-01-13',
              state: 'cancelled',
              from_location: {
                title: 'WETHERBY (HMPYOI)',
              },
              to_location: {
                title: 'Exeter Probation Office',
              },
            },
          ]

          expect(moveToJourneysSummary(move, journeys)).to.deep.equal([
            {
              context: undefined,
              date: '7 Oct 2020',
              fromLocation: 'Guildford Custody Suite',
              toLocation: 'HMP Brixton',
            },
          ])
        })
      }
    )

    context(
      'when the move is locked out and there is one journey',
      function () {
        it('will present the journeys correctly', function () {
          const move = {
            date: '2020-10-07',
            is_lockout: true,
            from_location: {
              title: 'Guildford Custody Suite',
            },
            to_location: {
              title: 'HMP Brixton',
            },
          }

          const journeys = [
            {
              date: '2020-10-07',
              from_location: {
                title: 'WETHERBY (HMPYOI)',
              },
              to_location: {
                title: 'Exeter Probation Office',
              },
            },
          ]

          expect(moveToJourneysSummary(move, journeys)).to.deep.equal([
            {
              date: '7 Oct 2020',
              fromLocation: 'Guildford Custody Suite',
              toLocation: '(awaiting destination)',
            },
            {
              date: '(awaiting date)',
              fromLocation: '(awaiting location)',
              toLocation: 'HMP Brixton',
            },
          ])
        })
      }
    )

    context(
      'when the move is not locked out and there is a journey on the same date',
      function () {
        it('will present the journeys correctly', function () {
          const move = {
            date: '2020-10-07',
            is_lockout: false,
            from_location: {
              title: 'Guildford Custody Suite',
            },
            to_location: {
              title: 'HMP Brixton',
            },
          }

          const journeys = [
            {
              date: '2020-10-07',
              from_location: {
                title: 'Guildford Custody Suite',
              },
              to_location: {
                title: 'Exeter Probation Office',
              },
            },
          ]

          expect(moveToJourneysSummary(move, journeys)).to.deep.equal([
            {
              context: undefined,
              date: '7 Oct 2020',
              fromLocation: 'Guildford Custody Suite',
              toLocation: 'HMP Brixton',
            },
          ])
        })
      }
    )
  })
})
