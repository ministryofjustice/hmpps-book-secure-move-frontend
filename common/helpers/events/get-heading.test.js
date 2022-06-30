const i18n = require('../../../config/i18n').default

const getHeading = require('./get-heading')

describe('Helpers', function () {
  describe('Events', function () {
    const mockEvent = {
      id: 'eventId',
      event_type: 'eventType',
      details: 'details',
    }
    const mockEventWithCount = {
      ...mockEvent,
      _index: 3,
    }

    beforeEach(function () {
      sinon.stub(i18n, 't').returnsArg(0)
      sinon.stub(i18n, 'exists').returns(false)
    })

    describe('#getHeading', function () {
      let heading

      context('when event has no count', function () {
        beforeEach(function () {
          heading = getHeading(mockEvent)
        })

        it('should get the heading string', function () {
          expect(i18n.t).to.be.calledOnceWithExactly(
            'events::eventType.heading',
            'details'
          )
        })

        it('should return the heading', function () {
          expect(heading).to.equal('events::eventType.heading')
        })
      })

      context('when event has count', function () {
        beforeEach(function () {
          heading = getHeading(mockEventWithCount)
        })

        it('should get the heading string', function () {
          expect(i18n.t).to.be.calledOnceWithExactly(
            'events::eventType.heading',
            'details'
          )
        })

        it('should return the heading', function () {
          expect(heading).to.equal('events::eventType.heading (3)')
        })
      })
    })
  })
})
