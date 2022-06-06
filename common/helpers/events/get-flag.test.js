const i18n = require('../../../config/i18n').default

const getFlag = require('./get-flag')

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

    describe('#getFlag', function () {
      let flag

      context('when event has no classification', function () {
        beforeEach(function () {
          flag = getFlag(mockEvent)
        })

        it('should return undefined', function () {
          expect(flag).to.equal(undefined)
        })
      })

      context('when event has default classification', function () {
        beforeEach(function () {
          flag = getFlag(mockEventWithDefaultClassification)
        })

        it('should return undefined', function () {
          expect(flag).to.equal(undefined)
        })
      })

      context('when event has medical classification', function () {
        beforeEach(function () {
          flag = getFlag(mockEventWithMedicalClassification)
        })

        it('should get classification string', function () {
          expect(i18n.t).to.be.calledOnceWithExactly(
            'events::classification.medical'
          )
        })

        it('should return expected flag properties', function () {
          expect(flag).to.deep.equal({
            html: 'events::classification.medical',
            type: 'medical',
          })
        })
      })

      context('when event has incident classification', function () {
        beforeEach(function () {
          flag = getFlag(mockEventWithIncidentClassification)
        })

        it('should get classification string', function () {
          expect(i18n.t).to.be.calledOnceWithExactly(
            'events::classification.incident'
          )
        })

        it('should return expected flag properties', function () {
          expect(flag).to.deep.equal({
            html: 'events::classification.incident',
            type: 'incident',
          })
        })
      })
    })
  })
})
