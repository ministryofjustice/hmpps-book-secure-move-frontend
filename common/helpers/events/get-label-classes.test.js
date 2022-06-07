const i18n = require('../../../config/i18n').default

const getLabelClasses = require('./get-label-classes')

describe('Helpers', function () {
  describe('Events', function () {
    const mockEvent = {
      id: 'eventId',
      event_type: 'eventType',
      details: 'details',
    }

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(i18n, 'exists').returns(false)
    })

    describe('#getLabelClasses', function () {
      let labelClasses

      context('when event is not a triggered status change', function () {
        beforeEach(function () {
          labelClasses = getLabelClasses(mockEvent)
        })

        it('should invoke i18n.exists expected number of times', function () {
          expect(i18n.exists).to.be.calledOnceWithExactly(
            'events::eventType.statusChange'
          )
        })

        it('should return undefined', function () {
          expect(labelClasses).to.equal(undefined)
        })
      })

      context('when event is a triggered status change', function () {
        beforeEach(function () {
          i18n.exists.returns(true)
          labelClasses = getLabelClasses(mockEvent)
        })

        it('should invoke i18n.exists expected number of times', function () {
          expect(i18n.exists).to.be.calledOnceWithExactly(
            'events::eventType.statusChange'
          )
        })

        it('should return the expected label classes', function () {
          expect(labelClasses).to.equal('moj-badge')
        })
      })
    })
  })
})
