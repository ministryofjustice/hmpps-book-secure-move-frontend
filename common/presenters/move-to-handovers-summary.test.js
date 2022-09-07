const moveToHandoversSummary = require('./move-to-handovers-summary')

describe('Presenters', function () {
  describe('#moveToHandoversSummary()', function () {
    context('when the move has not started', function () {
      const move = {
        status: 'booked',
        from_location: { title: 'Location' },
      }

      const journeys = []

      context('when there are no handover events', function () {
        it('will present the handovers correctly', function () {
          const thisMove = {
            ...move,
            important_events: [],
          }

          expect(
            moveToHandoversSummary(thisMove, journeys, false)
          ).to.deep.equal([])
        })
      })

      context('when there are handover events', function () {
        it('will present the handovers correctly', function () {
          const thisMove = {
            ...move,
            important_events: [
              {
                event_type: 'PerHandover',
                id: 'abc',
                occurred_at: '2022-08-01T01:23:45+00:00',
              },
            ],
          }

          expect(
            moveToHandoversSummary(thisMove, journeys, false)
          ).to.deep.equal([
            {
              recorded: true,
              event: 'abc',
              location: 'Location',
            },
          ])
        })
      })
    })

    context('when the move has started', function () {
      const move = {
        status: 'in_transit',
        from_location: { title: 'Location' },
      }

      const journeys = [
        {
          from_location: { title: 'Location' },
        },
      ]

      context('when there are no handover events', function () {
        it('will present the handovers correctly', function () {
          const thisMove = {
            ...move,
            important_events: [],
          }

          expect(
            moveToHandoversSummary(thisMove, journeys, false)
          ).to.deep.equal([
            {
              recorded: false,
              location: 'Location',
            },
          ])
        })
      })

      context('when there are handover events', function () {
        it('will present the handovers correctly', function () {
          const thisMove = {
            ...move,
            important_events: [
              {
                event_type: 'PerHandover',
                id: 'abc',
                occurred_at: '2022-08-01T01:23:45+00:00',
              },
            ],
          }

          expect(
            moveToHandoversSummary(thisMove, journeys, false)
          ).to.deep.equal([
            {
              recorded: true,
              event: 'abc',
              location: 'Location',
            },
          ])
        })
      })

      context('with multiple journeys', function () {
        const thisJourneys = [
          {
            from_location: { id: 'loc1', title: 'Location 1' },
          },
          {
            from_location: { id: 'loc2', title: 'Location 2' },
            date: '2022-08-01',
          },
          {
            from_location: { id: 'loc3', title: 'Location 3' },
          },
        ]

        it('will present the handovers correctly when awaiting for one', function () {
          const thisMove = {
            ...move,
            from_location: {
              id: 'loc1',
              title: 'Location 1',
            },
            important_events: [
              {
                event_type: 'PerHandover',
                id: 'abc',
                occurred_at: '2022-08-01T01:23:45+00:00',
              },
              {
                event_type: 'PerHandover',
                id: 'def',
                location: { id: 'loc2' },
                occurred_at: '2022-07-28T01:23:45+00:00',
              },
            ],
          }

          expect(
            moveToHandoversSummary(thisMove, thisJourneys, false)
          ).to.deep.equal([
            {
              recorded: true,
              event: 'abc',
              location: 'Location 1',
            },
            {
              recorded: false,
              location: 'Location 2',
            },
            {
              recorded: false,
              location: 'Location 3',
            },
          ])
        })

        it('will present the handovers correctly when recorded', function () {
          const thisMove = {
            ...move,
            from_location: {
              id: 'loc1',
              title: 'Location 1',
            },
            important_events: [
              {
                event_type: 'PerHandover',
                id: 'abc',
                occurred_at: '2022-08-01T01:23:45+00:00',
              },
              {
                event_type: 'PerHandover',
                id: 'def',
                location: { id: 'loc2' },
                occurred_at: '2022-08-01T01:23:45+00:00',
              },
              {
                event_type: 'PerHandover',
                id: 'ghi',
                location: { id: 'loc3' },
                occurred_at: '2022-08-01T01:23:46+00:00',
              },
            ],
          }

          expect(
            moveToHandoversSummary(thisMove, thisJourneys, false)
          ).to.deep.equal([
            {
              recorded: true,
              event: 'abc',
              location: 'Location 1',
            },
            {
              recorded: true,
              event: 'def',
              location: 'Location 2',
            },
            {
              recorded: true,
              event: 'ghi',
              location: 'Location 3',
            },
          ])
        })
      })
    })
  })
})
