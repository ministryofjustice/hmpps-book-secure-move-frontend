const eventDetailsHelpers = require('./event-details-helpers')
const setEventDetails = require('./set-event-details')

const mockEvent = { event_type: 'foo', details: { detailProp: 'detailProp' } }

describe('Timeline events', function () {
  describe('#setEventDetails', function () {
    let events

    const mockMove = { move: 'move' }
    beforeEach(function () {
      events = {}
      sinon.stub(eventDetailsHelpers, 'getMoveDetails').returns({
        ...mockMove,
        person: 'person',
      })
      sinon
        .stub(eventDetailsHelpers, 'getEventAgency')
        .returns({ agency: 'agency' })
      sinon
        .stub(eventDetailsHelpers, 'getEventContext')
        .returns({ context: 'context' })
      sinon
        .stub(eventDetailsHelpers, 'getEventRelationships')
        .returns({ eventRelationship: 'eventRelationship' })
      sinon
        .stub(eventDetailsHelpers, 'getEventableDetails')
        .returns({ eventDetail: 'eventDetail' })
      sinon
        .stub(eventDetailsHelpers, 'getEventProperties')
        .returns({ eventProp: 'eventProp' })
    })

    context('When setting the details for an event', function () {
      beforeEach(function () {
        events = setEventDetails(mockEvent, mockMove)
      })

      it('should add the move details', function () {
        expect(eventDetailsHelpers.getMoveDetails).to.be.calledOnceWithExactly(
          mockMove
        )
      })

      it('should add the event agency', function () {
        expect(eventDetailsHelpers.getEventAgency).to.be.calledOnceWithExactly(
          mockEvent
        )
      })

      it('should add the event context', function () {
        expect(eventDetailsHelpers.getEventContext).to.be.calledOnceWithExactly(
          mockEvent
        )
      })

      it('should add the event relationships', function () {
        expect(
          eventDetailsHelpers.getEventRelationships
        ).to.be.calledOnceWithExactly(mockEvent)
      })

      it('should add the eventable', function () {
        expect(
          eventDetailsHelpers.getEventableDetails
        ).to.be.calledOnceWithExactly(mockEvent)
      })

      it('should add the event properties', function () {
        expect(
          eventDetailsHelpers.getEventProperties
        ).to.be.calledOnceWithExactly(mockEvent)
      })

      it('should return the combined details', function () {
        expect(events).to.deep.equal({
          event_type: 'foo',
          details: {
            move: 'move',
            person: 'person',
            agency: 'agency',
            context: 'context',
            eventRelationship: 'eventRelationship',
            eventDetail: 'eventDetail',
            eventProp: 'eventProp',
            detailProp: 'detailProp',
          },
        })
      })
    })
  })
})
