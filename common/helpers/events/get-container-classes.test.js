const i18n = require('../../../config/i18n').default

const getContainerClasses = require('./get-container-classes')

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

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(i18n, 'exists').returns(false)
    })

    describe('#getContainerClasses', function () {
      let containerClasses

      context('when event has no classification', function () {
        beforeEach(function () {
          containerClasses = getContainerClasses(mockEvent)
        })

        it('should return an empty string', function () {
          expect(containerClasses).to.equal('')
        })
      })

      context('when event has default classification', function () {
        beforeEach(function () {
          containerClasses = getContainerClasses(
            mockEventWithDefaultClassification
          )
        })

        it('should return an empty string', function () {
          expect(containerClasses).to.equal('')
        })
      })

      context('when event has medical classification', function () {
        beforeEach(function () {
          containerClasses = getContainerClasses(
            mockEventWithMedicalClassification
          )
        })

        it('should return expected classes', function () {
          expect(containerClasses).to.deep.equal('app-panel')
        })
      })

      context('when event has incident classification', function () {
        beforeEach(function () {
          containerClasses = getContainerClasses(
            mockEventWithIncidentClassification
          )
        })

        it('should return expected classes', function () {
          expect(containerClasses).to.deep.equal('app-panel')
        })
      })
    })
  })
})
