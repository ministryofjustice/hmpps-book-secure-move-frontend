const proxyquire = require('proxyquire')

const i18n = require('../../config/i18n')

const addTriggeredEvents = sinon.stub().returnsArg(0)
const setEventDetails = sinon.stub().returnsArg(0)

const eventsToTimelineComponent = proxyquire('./events-to-timeline-component', {
  '../helpers/events/add-triggered-events': addTriggeredEvents,
  '../helpers/events/set-event-details': setEventDetails,
})

describe('Presenters', function () {
  describe('#eventsToTimelineComponent()', function () {
    let transformedResponse
    const mockEvents = [
      {
        event_type: 'foo',
        occurred_at: '2020-10-03',
        details: {
          hello: 'world',
        },
      },
    ]
    const mockMove = { id: 'move', timeline_events: mockEvents }

    beforeEach(function () {
      addTriggeredEvents.resetHistory()
      setEventDetails.resetHistory()
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(i18n, 'exists').returns(false)
    })

    context('when transforming event', function () {
      beforeEach(function () {
        transformedResponse = eventsToTimelineComponent(mockEvents, mockMove)
      })

      it('should add triggered events if needed', function () {
        expect(addTriggeredEvents).to.be.calledOnceWithExactly(mockEvents)
      })

      it('should set the event details', function () {
        expect(setEventDetails).to.be.calledOnceWithExactly(
          mockEvents[0],
          mockMove
        )
      })

      it('should check whether the event is a triggered status change', function () {
        expect(i18n.exists).to.be.calledOnceWithExactly(
          'events::foo.statusChange'
        )
      })

      it('should get the expected number of i18n string', function () {
        expect(i18n.t).to.be.calledTwice
      })

      it('should get the heading for the event', function () {
        expect(i18n.t.firstCall.args).to.deep.equal([
          'events::foo.heading',
          mockEvents[0].details,
        ])
      })

      it('should get the heading for the event', function () {
        expect(i18n.t.secondCall.args).to.deep.equal([
          'events::foo.description',
          mockEvents[0].details,
        ])
      })

      it('should return the expected data', function () {
        expect(transformedResponse).to.deep.equal({
          items: [
            {
              label: { html: 'events::foo.heading', classes: undefined },
              classes: 'app-timeline__item',
              html: 'events::foo.description',
              datetime: { timestamp: '2020-10-03', type: 'datetime' },
              byline: { html: '' },
            },
          ],
        })
      })
    })

    context('when event is a triggered status change', function () {
      beforeEach(function () {
        i18n.exists.returns(true)
        transformedResponse = eventsToTimelineComponent(mockEvents, mockMove)
      })

      it('should add the expected class name', function () {
        expect(transformedResponse.items[0].label.classes).to.equal('moj-badge')
      })
    })

    context(
      'when event description starts with an HTML line break',
      function () {
        beforeEach(function () {
          i18n.t.onCall(1).returns('<br>description')
          transformedResponse = eventsToTimelineComponent(mockEvents)
        })

        it('should strip the leading line break', function () {
          expect(transformedResponse.items[0].html).to.equal('description')
        })
      }
    )
  })
})
