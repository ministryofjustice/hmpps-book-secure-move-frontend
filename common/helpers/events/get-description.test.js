const i18n = require('../../../config/i18n')

const getDescription = require('./get-description')

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

    describe('#getDescription', function () {
      let description

      context('when fetching the description', function () {
        beforeEach(function () {
          i18n.t.onCall(0).returns(' <br><br>description<br>more description')
          description = getDescription(mockEvent)
        })

        it('should get description string', function () {
          expect(i18n.t).to.be.calledOnceWithExactly(
            'events::eventType.description',
            'details'
          )
        })

        it('should strip any leading <br>s and return the description', function () {
          expect(description).to.equal('description<br>more description')
        })
      })
    })
  })
})
