const getHeaderClasses = require('./get-header-classes')

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

    describe('#getHeaderClasses', function () {
      let headerClasses

      context('when event has no classification', function () {
        beforeEach(function () {
          headerClasses = getHeaderClasses(mockEvent)
        })

        it('should return an empty string', function () {
          expect(headerClasses).to.equal('')
        })
      })

      context('when event has default classification', function () {
        beforeEach(function () {
          headerClasses = getHeaderClasses(mockEventWithDefaultClassification)
        })

        it('should return an empty string', function () {
          expect(headerClasses).to.equal('')
        })
      })

      context('when event has medical classification', function () {
        beforeEach(function () {
          headerClasses = getHeaderClasses(mockEventWithMedicalClassification)
        })

        it('should return expected classes', function () {
          expect(headerClasses).to.deep.equal('app-tag')
        })
      })

      context('when event has incident classification', function () {
        beforeEach(function () {
          headerClasses = getHeaderClasses(mockEventWithIncidentClassification)
        })

        it('should return expected classes', function () {
          expect(headerClasses).to.deep.equal('app-tag app-tag--destructive')
        })
      })

      context('when event has property change event type', function () {
        beforeEach(function () {
          headerClasses = getHeaderClasses(mockEventWithPropertyChangeEventType)
        })

        it('should return expected classes', function () {
          expect(headerClasses).to.deep.equal('app-tag app-tag--inactive')
        })
      })
    })
  })
})
