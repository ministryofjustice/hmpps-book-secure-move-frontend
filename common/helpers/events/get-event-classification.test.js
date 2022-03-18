const getEventClassification = require('./get-event-classification')

describe('Helpers', function () {
  describe('Events', function () {
    const mockEvent = {
      id: 'eventId',
      event_type: 'eventType',
      details: 'details',
    }
    const mockEventWithDefaultClassification = {
      ...mockEvent,
      classification: 'default',
    }
    const mockEventWithMedicalClassification = {
      ...mockEvent,
      classification: 'medical',
    }
    const mockEventWithIncidentClassification = {
      ...mockEvent,
      classification: 'incident',
    }
    const mockEventWithPropertyChangeEventType = {
      ...mockEvent,
      event_type: 'PerPropertyChange',
      classification: 'default',
    }

    describe('#getEventClassification', function () {
      let classification

      context('when event has no classification', function () {
        beforeEach(function () {
          classification = getEventClassification(mockEvent)
        })

        it('should return undefined', function () {
          expect(classification).to.equal(undefined)
        })
      })

      context('when event has default classification', function () {
        beforeEach(function () {
          classification = getEventClassification(
            mockEventWithDefaultClassification
          )
        })

        it('should return undefined', function () {
          expect(classification).to.equal(undefined)
        })
      })

      context('when event has medical classification', function () {
        beforeEach(function () {
          classification = getEventClassification(
            mockEventWithMedicalClassification
          )
        })

        it('should return expected classification', function () {
          classification
          expect(classification).to.deep.equal('medical')
        })
      })

      context('when event has incident classification', function () {
        beforeEach(function () {
          classification = getEventClassification(
            mockEventWithIncidentClassification
          )
        })

        it('should return expected classification', function () {
          expect(classification).to.deep.equal('incident')
        })
      })

      context('when event has property change event type', function () {
        beforeEach(function () {
          classification = getEventClassification(
            mockEventWithPropertyChangeEventType
          )
        })

        it('should return expected classification', function () {
          classification
          expect(classification).to.deep.equal('default')
        })
      })
    })
  })
})
